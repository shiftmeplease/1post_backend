import mongoose from "mongoose";
const { Schema } = mongoose;
import { AutoIncrement } from "../dbInit.js";

const postSchema = new Schema(
  {
    _id: Number,
    body: {
      type: String,
      minLength: [3, "Possible post length is 3-100"],
      maxLength: [100, "Possible post length is 3-100"],
      unique: [true, "Same post already created"],
      validate: {
        //TODO markdown validator
        validator: function (value) {
          const lines = value.split("\n").length;
          return lines <= 10;
        },
        message: `More than 10 lines`,
      },
    },
    // ip: { type: Schema.Types.ObjectId, ref: "IpEntry" },
    //   comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    // views: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    // hidden: Boolean,
    // country: { type: String, index: true },
  },
  { _id: false }
);

postSchema.plugin(AutoIncrement);

postSchema.statics.random = async function (num) {
  const amount = await this.countDocuments();
  if (num > 3 || num >= amount) {
    throw new Error("Random >= amount documents || Random > 3");
  }

  const rndArr = [];
  for (let i = 0; i < num; i++) {
    rndArr[i] = getRandom(amount, rndArr);
  }

  return rndArr.map((val) => {
    return { _id: val };
  });
};

postSchema.methods.findDupe = async function () {
  const { body } = this;
  const result = await mongoose.model("Post").findOne({ body });
  if (!result || result === null) {
    return;
  }
  throw new Error("Same post already created");
};

const Post = mongoose.model("Post", postSchema);

function getRandom(max, rndArr) {
  const min = 1;
  let rnd;
  do {
    rnd = Math.round(min - 0.5 + Math.random() * (max - min + 1));
  } while (rndArr.indexOf(rnd) >= 0);
  return rnd;
}

export default Post;
