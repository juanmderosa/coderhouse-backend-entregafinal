export default class MockingRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getProducts = async () => {
    return await this.dao.getProducts();
  };
}
