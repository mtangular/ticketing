import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@tmangtickets/common";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  //create an instance of the Listener
  const listener = new OrderCreatedListener(natsWrapper.client);
  //create a ticket
  const ticket = Ticket.build({ title: "concert", price: 300, userId: "sdsds" });
  await ticket.save();
  //create the fake data event
  const data: OrderCreatedEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: "ddsdsa",
    expiresAt: "sdads",
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, ticket, data, msg };
};

it("sets the userId of the ticket", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(data.id).toEqual(updatedTicket.orderId);
});

it("acks the message", async () => {});
