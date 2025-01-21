import { PaymentModel, IPayment } from "../databases/mongodb/payment.model";

export class PaymentRepository {
  public async createPayment(data: Partial<IPayment>): Promise<IPayment> {
    const payment = new PaymentModel(data);
    return payment.save();
  }

  public async findByColocation(colocationId: string): Promise<IPayment[]> {
    return PaymentModel.find({
      colocationId,
    });
  }
}
