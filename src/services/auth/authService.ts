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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiredAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    await prisma.passwordResetToken.deleteMany({ where: { email } });

    await prisma.passwordResetToken.create({
      data: {
        email,
        token: otp,
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

    await transporter.sendMail({
      from: `"Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Reset Password Akun Anda',
      html: `
        <p>Halo ${user.name},</p>
        <p>Kode OTP untuk reset password Anda adalah:</p>
        <h2 style="font-size: 28px; letter-spacing: 4px;">${otp}</h2>
        <p>OTP ini berlaku selama 10 menit.</p>
      `,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error requesting password reset: ' + error.message);
    }
    throw new Error('Unknown error requesting password reset');
  }
};

export const verifyResetTokenService = async (otp: string, email: string) => {
  try {
    const result = await prisma.passwordResetToken.findFirst({
      where: { token: otp, email },
    });

    if (!result) throw new Error('OTP is invalid');
    if (result.expired_at < new Date()) throw new Error('OTP has expired');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error verifying OTP: ' + error.message);
    }
    throw new Error('Unknown error verifying OTP');
  }
};

export const resetPasswordService = async (
  otp: string,
  newPassword: string,
  email: string,
) => {
  try {
    const record = await prisma.passwordResetToken.findFirst({
      where: { token: otp, email },
    });

    if (!record) throw new Error('OTP is invalid');
    if (record.expired_at < new Date()) throw new Error('OTP has expired');

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.deleteMany({ where: { email } });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error resetting password: ' + error.message);
    }
    throw new Error('Unknown error resetting password');
  }
};
