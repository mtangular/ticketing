import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { param } from "express-validator";
import { requireAuth, NotFoundError, NotAuthorisedError } from "@tmangtickets/common";
import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  [
    param("orderId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("OrderId must be provided"),
  ],
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorisedError();
    }
    res.send(order);
  }
);

export { router as showOrderRouter };
