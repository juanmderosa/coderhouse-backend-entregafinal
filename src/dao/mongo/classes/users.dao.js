import userModel from "../models/users.model.js";

export default class Users {
  getAllUsers = async () => {
    const users = await userModel.find();
    return users;
  };

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

  deleteUser = async (id) => {
    let deletedUser = await userModel.deleteOne({ _id: id });
    return deletedUser;
  };

  deleteUsersWithoutActivity = async (time) => {
    const deletedUsers = await userModel.deleteMany({
      $or: [
        { last_connection: { $lt: time.toString() } },
        { last_connection: { $exists: false } },
      ],
    });
    return deletedUsers;
  };

  uploadFile = async (file) => {
    const newFile = await userModel.create(file);
    return newFile;
  };
}
