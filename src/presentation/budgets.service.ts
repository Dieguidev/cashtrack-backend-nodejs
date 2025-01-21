import { prisma } from "../data/prisma/prisma-db"
import { BudgetEntity, CreaateBudgetDto } from "../domain";

export class Budgetservice {
  async getAllBudgets(){
    const budgets = await prisma.budget.findMany()
    const budgetsEntity = budgets.map(budget=>(
      BudgetEntity.fromJson(budget)
    ))
    return budgetsEntity;
  }

  async createBudget(createBudgetDto: CreaateBudgetDto){
    const budget = await prisma.budget.create({
      data: createBudgetDto
    })
    return BudgetEntity.fromJson(budget)
  }
}
