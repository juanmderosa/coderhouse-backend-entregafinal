import { enviroment } from "../config/config.js";
import UserDTO from "../dao/DTOs/userDTO.js";
import userModel from "../dao/mongo/models/users.model.js";
import MailingService from "../services/mail.service.js";
import { userService } from "../services/users.service.js";

class UserController {
  async getAllUsers(req, res) {
    const users = await userService.getAllUsers();
    const userDTOs = users.map((user) => new UserDTO(user));
    res.status(200).send({ status: "success", payload: userDTOs });
  }

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

  async deleteUser(req, res) {
    const { uid } = req.params;
    try {
      await userService.deleteUser(uid);
      res.send({ status: "success", message: "Se ha eliminado el usuario" });
    } catch (error) {
      res
        .status(500)
        .send({ status: "error", message: "Error eliminando el usuario" });
    }
  }

  async deleteUsersWithoutActivity(req, res) {
    const time = new Date();
    time.setDate(time.getDate() - 2);

    try {
      const usersToBeDeleted = await userModel.find({
        $or: [
          { last_connection: { $lt: time.toString() } },
          { last_connection: { $exists: false } },
        ],
      });

      if (usersToBeDeleted.length === 0) {
        return res.status(200).send({
          status: "success",
          message: "No hay usuarios inactivos para eliminar.",
        });
      }

      const mailer = new MailingService();
      for (const user of usersToBeDeleted) {
        await mailer.sendMail({
          from: "E-commerce Admin",
          to: user.email,
          subject: "Tu cuenta ha sido eliminada",
          html: `<div><h1>¡Hemos eliminado tu cuenta por inactividad!</h1>
            <a href="${enviroment.BASE_URL}/register">Si quieres volver a crear una cuenta puedes hacerlo desde aquí</a>
                </div>`,
        });
      }

      const result = await userService.deleteUsersWithoutActivity(time);

      res.status(200).send({
        status: "success",
        message: `${result.deletedCount} usuarios eliminados por inactividad.`,
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      res.status(500).send({
        status: "error",
        message: "Error eliminando los usuarios",
        error,
      });
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
