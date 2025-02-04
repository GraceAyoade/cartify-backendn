import nodemailer from "nodemailer";
import mg from "nodemailer-mailgun-transport";
import { IMailOptions } from "../types/types";
import ErrorResponse from "./errorResponse.utils";

const sendEmail = async (options: IMailOptions) => {
  if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
    return new ErrorResponse("One or more mailgun credentials not found", 400);
  }
  const auth = {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  };
  const transport = nodemailer.createTransport(mg({ auth }));

  const message = {
    from: `cartify@${process.env.MAILGUN_DOMAIN}`,
    to: options.email,
    text: options.message,
    subject: options.subject,
  };
  const info = await transport.sendMail(message);
  console.log(`Message sent: ${info.messageId}`);
};

export default sendEmail;
