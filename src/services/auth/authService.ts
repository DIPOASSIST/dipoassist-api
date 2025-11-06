import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { RegisterType } from '../../validator/auth/registerValidator';
import { ChangePasswordType } from '../../validator/auth/changePasswordValidator';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export const registerUserService = async (data: RegisterType) => {
  try {
    const result = await prisma.user.create({
      data: {
        id: uuidv4(),
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        phone_number: data.phone_number,
      },
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error creating user: ' + error.message);
    }
    throw new Error('Unknown error creating user');
  }
};

export const getUserByEmailService = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching user: ' + error.message);
    }
    throw new Error('Unknown error fetching user');
  }
};

export const getUserByIdService = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching user: ' + error.message);
    }
    throw new Error('Unknown error fetching user');
  }
};

export const getUserByUsernameService = async (username: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching user: ' + error.message);
    }
    throw new Error('Unknown error fetching user');
  }
};

export const changePasswordUserService = async (
  userId: string,
  data: ChangePasswordType,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isMatchPassword = await bcrypt.compare(
      data.current_password,
      user.password,
    );

    if (!isMatchPassword) {
      throw new Error('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(data.new_password, 10);

    const result = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedNewPassword,
      },
    });

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error changing password: ' + error.message);
    }
    throw new Error('Unknown error changing password');
  }
};

export const requestResetPasswordService = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    const token = uuidv4();
    const expiredAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expired_at: expiredAt,
      },
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${email}`;

    await transporter.sendMail({
      from: `"Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Reset Password Akun Anda',
      html: `
      <p>Halo ${user.name},</p>
      <p>Klik tautan berikut untuk mengatur ulang password Anda:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Link ini berlaku selama 15 menit.</p>
    `,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error requesting password reset: ' + error.message);
    }
    throw new Error('Unknown error requesting password reset');
  }
};

export const resetPasswordService = async (
  token: string,
  newPassword: string,
  email: string,
) => {
  try {
    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!record) throw new Error('Token tidak valid');
    if (record.expired_at < new Date())
      throw new Error('Token sudah kadaluarsa');
    if (record.email !== email)
      throw new Error('Token tidak sesuai dengan email');

    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) throw new Error('User tidak ditemukan');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email: email },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({ where: { token } });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error resetting password: ' + error.message);
    }
    throw new Error('Unknown error resetting password');
  }
};

export const verifyResetTokenService = async (token: string) => {
  try {
    const result = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!result) throw new Error('Token is invalid');
    if (result.expired_at < new Date()) throw new Error('Token has expired');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error verifying reset token: ' + error.message);
    }
    throw new Error('Unknown error verifying reset token');
  }
};
