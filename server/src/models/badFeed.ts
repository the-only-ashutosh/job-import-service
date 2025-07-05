import mongoose from "mongoose";

const badFeedSchema = new mongoose.Schema({
  feedUrl: { type: String, required: true },
  errorType: { type: String, required: true },
  errorMessage: String,
  rawSnapshot: String,
  failedAt: { type: Date, default: Date.now },
});

export default mongoose.model("BadFeed", badFeedSchema);
