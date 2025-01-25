import { Request, Response, RequestHandler } from "express-serve-static-core";
import { isEmail, isStrongPassword } from "validator";
import { createUser, findUserByEmail } from "../services/authService";

export const register: RequestHandler = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email) return res.status(400).send("Email is required");
    if (!password) return res.status(400).send("Password is required");

    if (!isEmail(email)) return res.status(400).send("Email address is not valid");
    if (!isStrongPassword(password)) return res.status(400).send("Please enter a strong password");

    const isUserExitWithEmail = await findUserByEmail(email);

    if (isUserExitWithEmail) return res.status(400).send("User already exist with email.");

    await createUser(email, password);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login: RequestHandler = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email) return res.status(400).send("Email is required");
    if (!password) return res.status(400).send("Password is required");

    if (!isEmail(email)) return res.status(400).send("Email address is not valid");

    const user = await findUserByEmail(email);

    if (!user) return res.status(401).json("Invalid credentials");

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = user.generateJwtToken();

    res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
