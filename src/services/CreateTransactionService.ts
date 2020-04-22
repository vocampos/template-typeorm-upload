import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateOrFindCategoryService from './CreateOrFindCategoryService';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > total) {
      throw new AppError('No value founds', 400);
    }

    const categoryService = new CreateOrFindCategoryService();

    const categoryResult = await categoryService.execute({
      title: category,
    });

    const repository = getRepository(Transaction);

    const transaction = repository.create({
      title,
      value,
      type,
      category_id: categoryResult.id,
    });

    await repository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
