
import mongoose, { Schema, Model } from "mongoose";

export interface IStoreSettings {
  storeName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  logoUrl: string;
  shippingCharge: number;
  freeShippingThreshold: number;
  codEnabled: boolean;
  onlinePaymentEnabled: boolean;
}

const StoreSettingsSchema = new Schema<IStoreSettings>(
  {
    storeName: {
      type: String,
      default: "Mydhili Boutique",
      trim: true,
    },
    tagline: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    whatsapp: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    city: {
      type: String,
      default: "",
      trim: true,
    },
    state: {
      type: String,
      default: "",
      trim: true,
    },
    pincode: {
      type: String,
      default: "",
      trim: true,
    },
    logoUrl: {
      type: String,
      default: "",
      trim: true,
    },
    shippingCharge: {
      type: Number,
      default: 0,
      min: 0,
    },
    freeShippingThreshold: {
      type: Number,
      default: 0,
      min: 0,
    },
    codEnabled: {
      type: Boolean,
      default: true,
    },
    onlinePaymentEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const StoreSettings: Model<IStoreSettings> =
  mongoose.models.StoreSettings ||
  mongoose.model<IStoreSettings>("StoreSettings", StoreSettingsSchema);

export default StoreSettings;
