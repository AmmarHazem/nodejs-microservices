import { Request, Response } from "express";
import { emitUserCreated } from "../kafka/producer";
import { UserModel } from "../models/UserModel";

export const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const newUser: UserModel = { id: Date.now(), name, email, orderCount: 0 };
  await emitUserCreated(newUser);
  res.status(201).json(newUser);
};
