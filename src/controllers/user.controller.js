import { usersRepository } from "../repositories/index.js";
import { userService } from "../services/users.service.js";

class UserController {
  async setUserRole(req, res) {
    const { uid } = req.params;
    const user = await userService.findUserById(uid);

    if (user.role === "admin") {
      return res.status(400).json({
        status: "error",
        message: "Los admins no pueden cambiar su rol",
      });
    }

    let newRole = null;
    if (user.role === "premium") {
      newRole = { role: "usuario" };
    } else if (user.role === "usuario") {
      const requiredDocuments = [
        "identificacion",
        "domicilio",
        "estado_cuenta",
      ];

      const hasRequiredDocuments = requiredDocuments.every((doc) =>
        user.documents.some((userDoc) => userDoc.name === doc)
      );

      if (!hasRequiredDocuments) {
        return res.status(400).json({
          status: "error",
          message: "No se ha terminado de cargar la documentación requerida",
        });
      }

      newRole = { role: "premium" };
    } else {
      return res
        .status(400)
        .json({ status: "error", message: "Rol no válido" });
    }

    try {
      await userService.updateUser(user, newRole);
      res.send({ status: "success", message: "Se ha actualizado el rol" });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Error actualizando el rol" });
    }
  }

  async uploadFile(req, res) {
    const { uid } = req.params;
    const files = req.files;

    const user = await userService.findUserById(uid);
    if (!user) {
      return res
        .status(404)
        .send({ status: "error", error: "No se encontro el usuario" });
    }

    try {
      if (!files || Object.keys(files).length === 0) {
        return res
          .status(400)
          .send({ status: "error", error: "No se ha cargado el archivo" });
      }

      const documents = [];
      Object.keys(files).forEach((fieldname) => {
        files[fieldname].forEach((file) => {
          documents.push({
            name: file.fieldname,
            reference: `/uploads/${fieldname}/${uid}`,
          });
        });
      });

      await userService.updateUser(user, { documents: documents });

      res.send({ status: "success", documents });
    } catch (error) {
      res.status(500).send({ status: "error", message: error });
    }
  }
}

export const userController = new UserController();
