import { Message } from "node-nats-streaming";
import { Subjects, Listener, OrderCancelledEvent } from "@tmangtickets/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    //find the ticket that the order is cancelling
    const ticket = await Ticket.findById(data.ticket.id);
    //if no ticket throw an error
    if (!ticket) {
      throw new Error("ticket not found");
    }
    //mark the ticket as being unreserved by the OrderId
    ticket.set({ orderId: undefined });
    //save the ticket
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      userId: ticket.userId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version,
    });
    //ack the message
    msg.ack();
  }
}
