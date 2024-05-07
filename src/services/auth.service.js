import userModel from "../models/users.model.js";

const findUserByEmail = async (username) => {
  const user = await userModel.findOne({ email: username });
  return user;
};

const findUserById = async (id) => {
  const user = await userModel.findOne({ _id: id });
  return user;
};

const createUser = async (user) => {
  let createdUser = await userModel.create(user);
  return createdUser;
};

const updateUser = async (user, dataToUpdate) => {
  let updatedUser = await userModel.updateOne(
    { _id: user._id },
    { $set: dataToUpdate }
  );
  return updatedUser;
};

export default {
  findUserByEmail,
  createUser,
  updateUser,
  findUserById,
};
