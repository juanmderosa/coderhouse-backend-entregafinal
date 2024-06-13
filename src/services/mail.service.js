import mailer from "nodemailer";
import { enviroment } from "../config/config.js";

export default class MailingService {
  constructor() {
    this.client = mailer.createTransport({
      service: enviroment.mailing.SERVICE,
      host: enviroment.mailing.HOST,
      port: 587,
      auth: {
        user: enviroment.mailing.USER,
        pass: enviroment.mailing.PASSWORD,
      },
    });
  }

  sendMail = async ({ from, to, subject, html, attachments = [] }) => {
    let result = await this.client.sendMail({
      from,
      to,
      subject,
      html,
      attachments,
    });
    return result;
  };
}
