import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

const collection = "Products";

const schema = new Schema({
  title: {
    type: String,
    require: true,
    index: true,
  },
  description: {
    type: String,
    require: true,
    index: true,
  },
  price: {
    type: Number,
    require: true,
  },
  thumbnail: {
    type: [String],
    require: true,
  },
  code: {
    type: String,
    require: true,
  },
  stock: {
    type: Number,
    require: true,
  },
  status: {
    type: Boolean,
    require: true,
  },
});
schema.plugin(mongoosePaginate);
export const productsModel = mongoose.model(collection, schema);
