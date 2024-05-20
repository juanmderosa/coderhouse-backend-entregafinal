import mongoose from "mongoose";

const collection = "Users";

const schema = new mongoose.Schema({
  first_name: { type: String, require: true },
  last_name: { type: String, require: true },
  email: { type: String, require: true },
  age: { type: Number, require: true },
  password: { type: String, require: true },
  role: { type: String, require: true },
});

const userModel = mongoose.model(collection, schema);

export default userModel;
