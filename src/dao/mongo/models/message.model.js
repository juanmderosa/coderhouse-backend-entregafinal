import mongoose from "mongoose";
const { Schema } = mongoose;

const collection = "messages";

const schema = new Schema({
  email: { type: String },
  message: { type: String },
});

const messagesModel = mongoose.model(collection, schema);

export default messagesModel;
