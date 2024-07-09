import userModel from "../models/users.model.js";

export default class Users {
  findUserByEmail = async (username) => {
    const user = await userModel.findOne({ email: username });
    return user;
  };

  findUserById = async (id) => {
    const user = await userModel.findOne({ _id: id });
    return user;
  };

  createUser = async (user) => {
    let createdUser = await userModel.create(user);
    return createdUser;
  };

  updateUser = async (user, dataToUpdate) => {
    let updatedUser = await userModel.updateOne(
      { _id: user._id },
      { $set: dataToUpdate }
    );
    return updatedUser;
  };

  uploadFile = async (file) => {
    const newFile = await userModel.create(file);
    return newFile;
  };
}
