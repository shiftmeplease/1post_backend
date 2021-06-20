import mongoose from "mongoose";
const { Schema } = mongoose;
import { AutoIncrement } from "../dbInit.js";

const postSchema = new Schema(
  {
    _id: { type: Number },
    value: {
      type: String,
      text: true,
    },
    md: {
      type: String,
      // minLength: [1, "Possible post length is 1-300"],
      // maxLength: [300, "Possible post length is 1-300"],

      // validate: {
      //   //TODO markdown validator
      //   validator: function (value) {
      //     const lines = value.split("\n").length;
      //     return lines <= 15;
      //   },
      //   message: `Message is more than 15 lines`,
      // },
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

postSchema.methods.validateMd = async function () {
  const { md } = this;

  if (md.length > 300 || md.length < 1) {
    console.log(md.length);
    throw new Error("Possible post length is 1-300");
  }
  if (md.split("\n").length > 15) {
    console.log(md.split("\n").length);
    throw new Error("Message is more than 15 lines");
  }
  return true;
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
