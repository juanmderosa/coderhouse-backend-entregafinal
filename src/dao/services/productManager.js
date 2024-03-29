import __dirname from "../../utils.js";
import { productsModel } from "../models/products.js";

class ProductManager {
  async getProducts(page, limit, queryParam, sortParam) {
    try {
      let pageNumber = parseInt(page) || 1;
      let limitNumber = parseInt(limit) || 6;
      let query = {};
      let sort = {};

      if (sortParam === "asc" || sortParam === "desc") {
        sort = { price: sortParam };
      } else {
        sort = { title: sortParam };
      }

      if (queryParam !== "") {
        query = {
          $or: [
            { title: { $regex: queryParam, $options: "i" } },
            { description: { $regex: queryParam, $options: "i" } },
          ],
        };
      }

      const products = await productsModel.paginate(query, {
        page: pageNumber,
        limit: limitNumber,
        lean: true,
        sort,
      });

      const baseUrl = `http://localhost:8080/?limit=${limitNumber}`;

      const totalPages = products.totalPages;
      const hasNextPage = products.hasNextPage;
      const hasPrevPage = products.hasPrevPage;
      const nextPage = products.nextPage;
      const prevPage = products.prevPage;
      const status = products.docs.length > 0 ? "success" : "error";
      const payload = products.docs;

      const prevLink = hasPrevPage ? `${baseUrl}&page=${prevPage}` : null;
      const nextLink = hasNextPage ? `${baseUrl}&page=${nextPage}` : null;

      const response = {
        status: status,
        payload: payload,
        totalPages: totalPages,
        prevPage: prevPage,
        nextPage: nextPage,
        page: pageNumber,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage,
        prevLink: prevLink,
        nextLink: nextLink,
      };

      console.log(response);

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addProducts(product) {
    try {
      if (
        product.title ||
        product.description ||
        product.price ||
        product.code ||
        product.stock
      ) {
        product.status = product.status || true;
        let data = await productsModel.create(product);
        console.log(data);
        return data;
      } else {
        throw new Error(
          "Debes agregar todos los campos para crear un nuevo producto"
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getProductsById(id) {
    try {
      let data = await productsModel.findById(id);
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      let data = await productsModel.updateOne(
        { _id: id },
        { $set: updatedFields }
      );
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteProduct(id) {
    try {
      let data = await productsModel.deleteOne({ _id: id });
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
}

export const productManager = new ProductManager();
