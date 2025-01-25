import User from "../models/User";
import bcrypt from "bcrypt";

const hashPasswordPassword = function (password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const createUser = async function (email: string, password: string) {
  password = await hashPasswordPassword(password);
  return User.create({ email, password });
};

export const findUserByEmail = function (email: string) {
  return User.findOne({ email });
};
