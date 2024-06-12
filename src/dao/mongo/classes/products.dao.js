import { productsModel } from "../models/products.model.js";
import { CustomError } from "../../../utils/customError.js";
import { validateProduct } from "../../../utils/productsError.js";
import { errorTypes } from "../../../utils/errorTypes.js";

export default class Products {
  getProducts = async (page, limit, queryParam, sortParam) => {
    try {
      let pageNumber = parseInt(page) || 1;
      let limitNumber = parseInt(limit) || 10;
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

      return response;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  };

  getProductsById = async (id) => {
    try {
      let product = await productsModel.findById(id);
      return product;
    } catch (error) {
      logger.error(error);
    }
  };

  getProductsByCode = async (code) => {
    try {
      let product = await productsModel.findOne({ code: code });
      return product;
    } catch (error) {
      logger.error(error);
    }
  };

  addProducts = async (product) => {
    try {
      if (
        product.title &&
        product.description &&
        product.price &&
        product.code &&
        product.stock
      ) {
        product.status = product.status || true;
        let data = await productsModel.create(product);
        return data;
      } else {
        throw CustomError.CustomError(
          "Missing Data",
          "Enter all the properties",
          errorTypes.ERROR_INVALID_ARGUMENTS,
          validateProduct(product)
        );
      }
    } catch (error) {
      logger.error(error);
    }
  };

  updateProduct = async (id, updatedFields) => {
    try {
      let data = await productsModel.updateOne(
        { _id: id },
        { $set: updatedFields }
      );
      return data;
    } catch (error) {
      logger.error(error);
    }
  };

  deleteProduct = async (id) => {
    try {
      let data = await productsModel.deleteOne({ _id: id });
      return data;
    } catch (error) {
      logger.error(error);
    }
  };
}
