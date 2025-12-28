import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "bc87e3a4d84ba1",
    pass: "45aa102988684c",
  }
});

export const sendEmail = async (email: string, subject: string, text: string) => {
    await transport.sendMail({
        from: `TicketHub`,
        to: email,
        subject: subject,
        text: text,
    });
}