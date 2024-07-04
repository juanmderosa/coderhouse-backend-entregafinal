import * as chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest(`http://localhost:8080`);

describe("Test E-commerce API /products", function () {
  let createdProductId;
  let loggedUser;

  before(async function () {
    // Loguear usuario antes de las pruebas
    const response = await requester.post("/api/sessions/login").send({
      email: "adminCoder@coder.com",
      password: "adminCod3r123",
    });

    loggedUser = response.body;
    console.log("Logged User", loggedUser.payload);
  });

  describe("GET /products", function () {
    it("The endpoint api/products should return all the products", async () => {
      const { statusCode, _body, ok } = await requester.get("/api/products");

      expect(statusCode).to.equal(200);
      expect(ok).to.be.true;
      expect(_body.payload).to.be.an("array");
    });
  });

  describe("GET /products/:id", function () {
    it("The endpoint api/products/:id should return a product by id", async () => {
      const productId = "666f51b06a44ba6f2ce7301a";
      const { statusCode, body } = await requester.get(
        `/api/products/${productId}`
      );

      expect(statusCode).to.equal(200);
      expect(body).to.be.an("object");
      expect(body).to.have.property("_id");
      expect(body).to.have.property("title");
      expect(body).to.have.property("price");
      expect(body).to.have.property("description");
    });

    it("The endpoint api/products/:id should return a 400 status code if the product is not found", async () => {
      const nonExistentProductId = "abc";
      const result = await requester.get(
        `/api/products/${nonExistentProductId}`
      );

      expect(result.status).to.equal(400);
    });
  });

  describe("POST /api/products", function () {
    it("The endpoint api/products should create a product correctly", async function () {
      const productMock = {
        title: "Test Product",
        description: "Test Product",
        price: 10,
        thumbnail: ["image1.png"],
        code: "test",
        stock: 20,
        owner: "juanmderosa@gmail.com",
      };
      const { statusCode, ok, _body } = await requester
        .post("/api/products")
        .send(productMock);

      console.log(_body.payload);
      console.log(statusCode);
      console.log(ok);

      /* expect(ok).to.be.true;
      expect(statusCode).to.equal(201);
      expect(_body.payload).to.have.property("_id");
      expect(_body.payload._id).to.be.a("string"); */

      //createdProductId = _body.payload._id;
      //console.log(createdProductId);
    });
  });

  after(async function () {
    // Eliminar el producto creado después de cada prueba
    if (createdProductId) {
      await requester
        .delete(`/api/products/${createdProductId}`)
        .set("Authorization", `Bearer ${loggedUser.token}`);
      createdProductId = null;
    }
  });
});
