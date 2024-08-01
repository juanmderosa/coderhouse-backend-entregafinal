import { usersRepository } from "../repositories/index.js";

class usersService {
  getAllUsers = async () => {
    return await usersRepository.getAllUsers();
  };

  findUserByEmail = async (username) => {
    return await usersRepository.findUserByEmail(username);
  };

  findUserById = async (id) => {
    return await usersRepository.findUserById({ _id: id });
  };

  createUser = async (user) => {
    return await usersRepository.createUser(user);
  };

  updateUser = async (user, dataToUpdate) => {
    return await usersRepository.updateUser(user, dataToUpdate);
  };

  deleteUser = async (id) => {
    return await usersRepository.deleteUser(id);
  };

  deleteUsersWithoutActivity = async (time) => {
    return await usersRepository.deleteUsersWithoutActivity(time);
  };

  uploadFile = async (file) => {
    return await usersRepository.uploadFile(file);
  };
}

export const userService = new usersService();
