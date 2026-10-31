import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { getAdminSession } from "@/lib/auth";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
]);

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files: File[] = [];

    // Collect all files from "files" or "file" form field
    const multiFiles = formData.getAll("files");
    const singleFile = formData.get("file");

    if (multiFiles && multiFiles.length > 0) {
      for (const f of multiFiles) {
        if (f instanceof File && f.size > 0) {
          files.push(f);
        }
      }
    } else if (singleFile instanceof File && singleFile.size > 0) {
      files.push(singleFile);
    }

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No image files provided." },
        { status: 400 }
      );
    }

    // Check if Vercel Blob is configured via BLOB_READ_WRITE_TOKEN
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    const isVercelBlobConfigured = Boolean(blobToken);

    let uploadDir = "";
    if (isVercelBlobConfigured) {
      // Vercel Blob is active
    } else if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      // Running on Vercel serverless where local disk is read-only (EROFS)
      return NextResponse.json(
        {
          success: false,
          message:
            "Vercel Blob storage is not configured. Please add BLOB_READ_WRITE_TOKEN in your Vercel Project Settings -> Environment Variables and redeploy.",
        },
        { status: 500 }
      );
    } else {
      uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!ALLOWED_MIME_TYPES.has(file.type)) {
        return NextResponse.json(
          {
            success: false,
            message: `Unsupported file type: ${file.type || "unknown"}. Please upload a JPEG, PNG, WebP, GIF, or SVG.`,
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message: `File "${file.name}" exceeds the 15MB size limit.`,
          },
          { status: 400 }
        );
      }

      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const safeName = sanitizeFileName(file.name || "image.jpg");
      const fileName = `${timestamp}-${randomSuffix}-${safeName}`;

      if (isVercelBlobConfigured) {
        // Upload directly to Vercel Blob permanent global CDN
        const blob = await put(`uploads/${fileName}`, file, {
          access: "public",
          contentType: file.type,
          token: blobToken,
        });
        uploadedUrls.push(blob.url);
      } else {
        // Fallback for local development when BLOB_READ_WRITE_TOKEN is not yet set
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const destination = path.join(uploadDir, fileName);
        await writeFile(destination, buffer);
        uploadedUrls.push(`/uploads/${fileName}`);
      }
    }

    return NextResponse.json({
      success: true,
      message:
        uploadedUrls.length === 1
          ? "Image uploaded successfully."
          : `${uploadedUrls.length} images uploaded successfully.`,
      url: uploadedUrls[0],
      urls: uploadedUrls,
      storage: isVercelBlobConfigured ? "vercel-blob" : "local-disk",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to upload image.",
      },
      { status: 500 }
    );
  }
}
