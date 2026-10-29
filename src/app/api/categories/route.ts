import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";
import { success } from "zod";
import { count } from "console";

export async function GET (){
    try {
        await connectToDatabase();
        const categories = await Category.find({isActive:true})
        .sort({name: 1 })
        .lean();

        return NextResponse.json({
            success:true,
            count:categories.length,
            categories,
        })
    } catch (error) {
        console.error("failed to fetch categories:",error);

        return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
        
    }
}