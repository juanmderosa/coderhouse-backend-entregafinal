import { randomUUID } from "crypto";
import fs from "fs";
import rootDir from "../../utils/utils.js";
import { logger } from "../../utils/Logger.js";

class ProductManager {
  constructor(products = []) {
    this.products = products;
    this.path = `${rootDir}/data/productos.json`;
  }

  async getProducts() {
    try {
      const fileExists = fs.existsSync(this.path);
      let products = [];

      if (fileExists) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        if (data.trim() !== "") {
          products = JSON.parse(data);
        }
      } else {
        await fs.promises.writeFile(this.path, "[]");
      }

      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addProducts({
    title,
    description,
    price,
    status = true,
    code,
    stock,
    thumbnail = [],
  }) {
    if (!title || !description || !price || !code || !stock) {
      throw new Error(
        "Debes agregar todos los campos para crear un nuevo producto"
      );
    }

    const productsList = await this.getProducts();
    if (productsList.some((product) => product.code === code)) {
      throw new Error("El campo Code está repetido");
    }

    const id = randomUUID();

    const product = {
      id: id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status: this.status,
    };
    productsList.push(product);

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(productsList, null, "\t")
    );

    return product;
  }

  async getProductsById(id) {
    const productsList = await this.getProducts();
    const product = productsList.find((product) => product.id === id);

    if (!product) {
      logger.error("Producto no encontrado");
    }
    return product;
  }

  async updateProduct(id, updatedFields) {
    try {
      const productsList = await this.getProducts();
      const productIndex = productsList.findIndex(
        (product) => product.id === id
      );

      if (productIndex === -1) {
        logger.error("No existe un producto con ese ID");
        throw new Error("No existe un producto con ese ID");
      }
      const productUpdated = {
        ...productsList[productIndex],
        ...updatedFields,
      };
      productsList[productIndex] = productUpdated;
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(productsList, null, "\t")
      );

      return productUpdated;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteProduct(id) {
    const productsList = await this.getProducts();
    const productIndex = productsList.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      logger.error("No existe un producto con ese ID");
      throw new Error("No existe un producto con ese ID");
    } else {
      const productToDelete = productsList[productIndex];
      const filteredProducts = productsList.filter(
        (product) => product.id !== id
      );
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(filteredProducts, null, "\t")
      );
      return productToDelete;
    }
  }
}

export const productManager = new ProductManager();
