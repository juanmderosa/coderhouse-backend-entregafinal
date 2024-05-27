import mongoose from "mongoose";
import crypto from "crypto";

const { Schema } = mongoose;

const collection = "Tickets";

const schema = new Schema({
  code: {
    type: String,
    default: function () {
      return crypto.randomUUID();
    },
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

export const ticketsModel = mongoose.model(collection, schema);
