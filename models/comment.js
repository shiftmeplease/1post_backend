import { Schema, mongoose } from "mongoose";

const commentSchema = new Schema({
  body: String,
  ip: String,
  comments,
  date: { type: Date, default: Date.now },
  hidden: Boolean,
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
