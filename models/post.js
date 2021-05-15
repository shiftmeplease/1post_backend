import mongoose from "mongoose";
const { Schema } = mongoose;
import { AutoIncrement } from "../dbInit.js";

const postSchema = new Schema(
  {
    _id: { type: Number },
    value: {
      type: String,
      minLength: [3, "Possible post length is 3-100"],
      maxLength: [100, "Possible post length is 3-100"],
      // unique: [true, "Same post already created"],
      validate: {
        //TODO markdown validator
        validator: function (value) {
          const lines = value.split("\n").length;
          return lines <= 10;
        },
        message: `More than 10 lines`,
      },
      text: true,
    },
    ip: { type: Schema.Types.ObjectId, ref: "IpEntry" },
    //   comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    // views: { type: Number, default: 0 },
    //TODO timezones support?
    date: { type: Date, default: Date.now },
    // hidden: Boolean,
    country: { type: String, index: true },
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
  const { value } = this;
  const result = await mongoose.model("Post").findOne({ value });
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

//TODO search special computed tags: laconic, nigger, blm, etc..
//https://medium.com/dida-machine-learning/the-best-free-labeling-tools-for-text-annotation-in-nlp-844525c5c65b
//https://azure.microsoft.com/ru-ru/pricing/details/cognitive-services/text-analytics/
