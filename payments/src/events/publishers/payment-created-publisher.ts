import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
  NotFoundError,
  OrderStatus,
} from "@tmangtickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
