import MailingService from "../services/mail.service.js";
import { productService } from "../services/products.service.js";
import { userService } from "../services/users.service.js";

class ProductController {
  async getProducts(req, res) {
    try {
      let page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;
      let queryParam = req.query.query || "";
      let sortParam = req.query.sort || "desc";

      const response = await productService.getProducts(
        page,
        limit,
        queryParam,
        sortParam
      );

      req.logger.debug(response);
      res.status(200).json(response);
    } catch (error) {
      req.logger.error("No se pudo obtener el listado de produtos", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getProductsById(req, res) {
    let { pid } = req.params;
    try {
      const product = await productService.getProductsById(pid);
      if (!product) {
        req.logger.error("Producto no encontrado");
        return res.send({ error: "Producto no encontrado" });
      }
      req.logger.debug(product);
      res.json(product);
    } catch (error) {
      req.logger.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  async getProductsByCode(req, res) {
    let { code } = req.params;
    try {
      const product = await productService.getProductsByCode(code);
      if (!product) {
        req.logger.error("Producto no encontrado");
        return res.status(400).send({ error: "Producto no encontrado" });
      }
      req.logger.debug(product);
      res.status(200).json(product);
    } catch (error) {
      req.logger.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  async addProducts(req, res) {
    const newProduct = req.body;

    const user = req.session.user;
    if (user.role !== "premium") {
      req.logger.error(
        `El usuario ${user.email} no tiene el rol premium para crear un nuevo producto`
      );
      res
        .status(403)
        .send({ error: "No tienes permisos para realizar esta operación" });
      return;
    }

    try {
      let validProps = [
        "title",
        "description",
        "price",
        "code",
        "stock",
        "thumbnail",
        "status",
      ];
      let newproductProps = Object.keys(req.body);
      let valid = newproductProps.every((prop) => validProps.includes(prop));

      const hasAllRequiredProps = validProps.every(
        (prop) =>
          newproductProps.includes(prop) &&
          newProduct[prop] !== undefined &&
          newProduct[prop] !== null
      );
      if (!hasAllRequiredProps) {
        req.logger.warning("Faltan campos para crear el producto");
        return res.status(400).json({
          error:
            "Debes agregar todos los campos requeridos para crear un nuevo producto.",
          detalle: validProps,
        });
      }

      if (!hasAllRequiredProps) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({
          error: `You have entered invalid properties`,
          detalle: validProps,
        });
      }

      let exist = await productService.getProductsByCode(newProduct.code);
      if (exist) {
        req.logger.warning("El producto ya existe");
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({
          error: `The product with the code ${newProduct.code} already exists`,
        });
      }

      await productService.addProducts(newProduct);
      req.logger.info("El producto se creó correctamente", newProduct);
      res.status(201).json({ status: "success", newProduct });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    const productId = req.params.pid;
    const updatedFields = req.body;
    try {
      const updatedProduct = await productService.updateProduct(
        productId,
        updatedFields
      );
      req.logger.debug("Se editó el producto correctamente", updatedProduct);

      res.status(200).json({ status: "success", updatedProduct });
    } catch (error) {
      req.logger.error("No se pudo editar el producto", error);
      res.status(400).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    const productId = req.params.pid;
    let owner;
    try {
      const user = req.session.user;
      const product = await productService.getProductsById(productId);

      if (product.owner !== "adminCoder@coder.com") {
        owner = await userService.findUserByEmail(product.owner);
      }

      const isOwner = user.role === "admin" || user.email === owner.email;
      if (!isOwner) {
        req.logger.error(
          `El usuario ${user.email} no tiene el permiso para eliminar un producto`
        );
        res
          .status(403)
          .send({ error: "No tienes permisos para realizar esta operación" });
        return;
      }

      if (user.role !== "admin" && owner.role === "premium") {
        const mailer = new MailingService();
        await mailer.sendMail({
          from: "E-commerce Admin",
          to: owner.email,
          subject: `Hemos eliminado tu producto ${product.title}`,
          html: `<div><h1>¡Se ha eliminado un producto!</h1>
                  <h2>Detalle</h2>
                    <ul>
                      <li>Título: ${product.title}</li>
                      <li>Código: ${product.code}</li>
                      <li>Descripción: ${product.description}</li>
                      <li>Precio: ${product.price}</li>
                    </ul>
                  </div>`,
        });
      }

      await productService.deleteProduct(productId);
      req.logger.debug("Se eliminó el producto correctamente");
      res.status(200).json({ status: "success" });
    } catch (error) {
      req.logger.error("No se pudo eliminar el producto", error);
      res.status(400).json({ error: error.message });
    }
  }
}

export const productController = new ProductController();
