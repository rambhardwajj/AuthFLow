import Mailgen from "mailgen";
import { env } from "../configs/env";
import { CustomError } from "./CustomError";
import { capitalize } from "./helper";
// import { MailtrapClient } from "mailtrap";
import nodemailer from "nodemailer"

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "AuthFlow",
    link: env.CLIENT_URL,
  },
});

// const client = new MailtrapClient({
//   token: env.MAILTRAP_TOKEN,
// });

// const sendMail = async (email: string, subject: string, content: Mailgen.Content) => {
//   const html = mailGenerator.generate(content);
//   const text = mailGenerator.generatePlaintext(content);

//   const sender = {
//     email: env.MAILTRAP_SENDERMAIL,
//     name: "Auth Flow",
//   };

//   const recipients = [{ email }];

//   console.log({
//     from: sender,
//     to: recipients,
//     tokenPresent: !!env.MAILTRAP_TOKEN,
//   });

//   try {
//     await client.send({
//       from: sender,
//       to: recipients,
//       subject,
//       text,
//       html,
//     });
//   } catch (error: any) {
//     console.error("Mailtrap Error:", error.response?.data || error.message || error);
//     throw new CustomError(500, `Failed to send "${email}" email. `);
//   }
// };




const sendMail = async (
  email: string,
  subject: string,
  content: Mailgen.Content
) => {
  // transporter email ko serve krta hai
  const transporter = nodemailer.createTransport({
    host: env.MAILTRAP_HOST,
    port: env.MAILTRAP_PORT,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: env.MAILTRAP_USERNAME,
      pass: env.MAILTRAP_PASSWORD,
    },
  });

  const html = mailGenerator.generate(content);
  const text = mailGenerator.generatePlaintext(content);
  try {
    const info = await transporter.sendMail({
      from: env.MAILTRAP_SENDERMAIL, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text, // plain text body
      html, // html body
    });
    // console.log(info)
  } catch (error) {
    throw new CustomError(
      500,
      "Cannot send mail"
    );
  }
};


const emailVerificationMailContent = (fullName: string, link: string) => {
  return {
    body: {
      name: fullName,
      intro: "Welcome to AuthFlow! We're excited to have you on board.",
      action: {
        instructions:
          "To complete your registration, please verify your email by clicking the button below:",
        button: {
          color: "#22BC66",
          text: "Verify Email",
          link: link,
        },
      },

      outro:
        "If you have any questions or need support, just reply to this email—we're here to help!",
      signature: false,
    },
  };
};

const resetPasswordMailContent = (fullName: string, link: string) => {
  return {
    body: {
      name: fullName,
      intro: "It seems like you requested a password reset.",
      action: {
        instructions: "To reset your password, click the button below:",
        button: {
          color: "#FF613C",
          text: "Reset Password",
          link: link,
        },
      },
      outro:
        "If you didn't request this, please ignore this email, or contact support if you have concerns.",
      signature: false,
    },
  };
};

const sendVerificationMail = async (fullName: string, email: string, token: string) => {
  const link = `${env.SERVER_URL}/api/v1/auth/verify/${token}`;
  const capitalName = capitalize(fullName);

  await sendMail(email, "Verify Your Email", emailVerificationMailContent(capitalName, link));
};

const sendResetPasswordMail = async (fullName: string, email: string, token: string) => {
  const link = `${env.SERVER_URL}/api/v1/auth/password/reset${token}`;
  const capitalName = capitalize(fullName);

  await sendMail(email, "Reset Your Password", resetPasswordMailContent(capitalName, link));
};

export { sendVerificationMail, sendResetPasswordMail };
