import { prisma } from "../data/prisma/prisma-db"
import { BudgetEntity } from "../domain";

export class Budgetservice {
  async getAllBudgets(){
    const budgets = await prisma.budget.findMany()
    const budgetsEntity = budgets.map(budget=>(
      BudgetEntity.fromJson(budget)
    ))
    return budgetsEntity;
  }


}
