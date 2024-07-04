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

  deleteUser = async (id) => {
    return await usersRepository.deleteUser({ _id: id });
  };
}

export const userService = new usersService();
