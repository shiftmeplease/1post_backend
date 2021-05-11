import mongoose from "mongoose";
const { Schema } = mongoose;

const ipSchema = new Schema({
  ip: {
    type: String,
    unique: [true, "IP used"],
    required: [true, "IP is required"],
    index: true,
    validate: {
      validator: function (value) {
        return /^(\d{1,3}\.){3}\d{1,3}$/.test(value);
      },
      message: `Invalid IP`,
    },
  },
  country: {
    type: String,
  },
});

const IpEntry = mongoose.model("IpEntry", ipSchema);

export default IpEntry;
