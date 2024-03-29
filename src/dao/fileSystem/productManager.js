import { randomUUID } from "crypto";
import fs from "fs";
import __dirname from "../utils.js";

class ProductManager {
  constructor(products = []) {
    this.products = products;
    this.path = `${__dirname}/data/productos.json`;
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
    console.log("Parsed Data", productsList);

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(productsList, null, "\t")
    );

    console.log("producto agregado", product);
    console.log("lista de productos", this.products);
    return product;
  }

  async getProductsById(id) {
    const productsList = await this.getProducts();
    const product = productsList.find((product) => product.id === id);

    if (!product) {
      console.log("Product no encontrado");
    }
    console.log("GetProductById", product);
    return product;
  }

  async updateProduct(id, updatedFields) {
    try {
      const productsList = await this.getProducts();
      const productIndex = productsList.findIndex(
        (product) => product.id === id
      );

      if (productIndex === -1) {
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
    console.log(productIndex);
    if (productIndex === -1) {
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
      console.log("Deleted Product", productToDelete);
      return productToDelete;
    }
  }
}

export const productManager = new ProductManager();
