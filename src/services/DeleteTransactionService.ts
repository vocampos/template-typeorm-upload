import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const repository = getCustomRepository(TransactionsRepository);

    const transaction = await repository.findOne(id);

    if (!transaction) {
      throw new AppError('Transaction not found.', 400);
    }

    await repository.remove(transaction);
  }
}

export default DeleteTransactionService;
