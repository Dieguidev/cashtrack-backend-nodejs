import { Expense } from '@prisma/client';
import { prisma } from '../../data/prisma/prisma-db';
import { CreateExpenseDto, ExpenseEntity, UpdateExpenseDto } from '../../domain';

export class ExpenseService {
  async createExpense(budgetId: string, createExpenseDto: CreateExpenseDto) {
    const { amount, name } = createExpenseDto;
    const newExpense = await prisma.expense.create({
      data: {
        amount,
        name,
        budgetId,
      },
    });

    return ExpenseEntity.fromJson(newExpense);
  }

  async getExpenseByid(expense: Expense) {
    return ExpenseEntity.fromJson(expense);
  }

  async updateExpense(expenseId: string, updateExpenseDto: UpdateExpenseDto) {
    const expense =await  prisma.expense.update({
      where: {
        id: expenseId,
      },
      data: updateExpenseDto,
    });

    return ExpenseEntity.fromJson(expense)
  }

  async deleteExpense(expenseId: string) {
    const expense = await prisma.expense.delete({
      where: {
        id: expenseId,
      },
    });

    return ExpenseEntity.fromJson(expense);
  }
}
