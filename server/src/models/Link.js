// src/models/Link.js
import mongoose from 'mongoose';

const ClickSchema = mongoose.Schema({
  insertedAt: {
    type: Date,
    default: Date.now,
  },
  ipAddress: {
    type: String,
  },
});

const LinkSchema = mongoose.Schema(
  {
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    clicks: [
      {
        insertedAt: { type: Date, default: Date.now },
        ipAddress: { type: String },
        targetParamValue: { type: String }
      }
    ],
    targetParamName: { type: String, default: 't' }, // ברירת מחדל: "t"
    targetValues: [
      {
        name: String,
        value: String
      }
    ]
  },
  { timestamps: true }
);


const Link = mongoose.model('Link', LinkSchema);
export default Link;
