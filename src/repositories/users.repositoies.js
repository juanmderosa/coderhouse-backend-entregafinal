export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAllUsers = async () => {
    return this.dao.getAllUsers();
  };

  findUserByEmail = async (username) => {
    return this.dao.findUserByEmail(username);
  };

  findUserById = async (id) => {
    return this.dao.findUserById(id);
  };

  createUser = async (user) => {
    return this.dao.createUser(user);
  };

  updateUser = async (user, dataToUpdate) => {
    return this.dao.updateUser(user, dataToUpdate);
  };

  deleteUser = async (id) => {
    return this.dao.deleteUser(id);
  };

  deleteUsersWithoutActivity = async (time) => {
    return this.dao.deleteUsersWithoutActivity(time);
  };

  uploadFile = async (file) => {
    return this.dao.uploadFile(file);
  };
}
