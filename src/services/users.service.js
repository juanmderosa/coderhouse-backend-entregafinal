import { usersRepository } from "../repositories/index.js";

class usersService {
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

  uploadFile = async (file) => {
    return await usersRepository.uploadFile(file);
  };
}

export const userService = new usersService();
