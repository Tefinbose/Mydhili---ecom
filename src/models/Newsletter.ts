import mongoose, { Schema, type Model } from "mongoose";

export interface INewsletter {
  email: string;
  status: "active" | "unsubscribed";
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSchema = new Schema<INewsletter>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "unsubscribed"],
      default: "active",
      index: true,
    },
    source: {
      type: String,
      default: "website_footer",
      trim: true,
    },
  },
  { timestamps: true }
);

const Newsletter: Model<INewsletter> =
  (mongoose.models.Newsletter as Model<INewsletter>) ||
  mongoose.model<INewsletter>("Newsletter", NewsletterSchema);

export default Newsletter;
