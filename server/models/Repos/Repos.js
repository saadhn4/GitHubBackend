import mongoose from "mongoose";

const repoSchema = new mongoose.Schema(
  {
    repoName: { type: String, required: true },
    description: { type: String },
    keywords: [{ type: String }],
    type: { type: String, required: true },
    branch: { type: String, required: true },
    url: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const repoModel = mongoose.model("repos", repoSchema, "repos");

export default repoModel;
