import * as chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest(`http://localhost:8080`);

describe("Test E-commerce API /sessions", function () {
  let userId;

  describe("POST /register", function () {
    it("The endpoint api/sessions/register should register a new user", async function () {
      const userMock = {
        first_name: "Session",
        last_name: "Test",
        email: "sessiontest@mail.com",
        password: "1233",
      };

      const { statusCode, _body, ok } = await requester
        .post("/api/sessions/register")
        .send(userMock);

      expect(statusCode).to.be.ok;
      expect(statusCode).to.be.equal(201);
      expect(_body.status).to.be.equal("success");

      userId = _body.payload._id;
    });
  });

  describe("POST /login", function () {
    it("The endpoint api/sessions/login should login a user", async function () {
      const userMock = {
        email: "sessiontest@mail.com",
        password: "1233",
      };

      const { statusCode, _body, ok } = await requester
        .post("/api/sessions/login")
        .send(userMock);

      expect(statusCode).to.be.ok;
      expect(statusCode).to.be.equal(200);
      expect(ok).to.be.true;
      expect(_body.status).to.be.equal("success");
      expect(_body.payload).to.have.property("_id").and.to.be.equal(userId);
    });
  });

  describe("POST /logout", function () {
    it("The endpoint api/sessions/logout should logout a user", async function () {
      const { statusCode, _body, ok } = await requester.get(
        "/api/sessions/logout"
      );

      expect(statusCode).to.be.ok;
      expect(statusCode).to.be.equal(200);
      expect(ok).to.be.true;
      expect(_body.status).to.be.equal("success");
    });
  });

  after(async function () {
    this.timeout(5000);
    if (userId) {
      try {
        await requester.delete(`/api/users/${userId}`);
        console.log(`Usuario con ID ${userId} eliminado.`);
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
      }
      userId = null;
    }
  });
});
