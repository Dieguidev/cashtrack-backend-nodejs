import { createRequest, createResponse } from 'node-mocks-http';
import { BudgetController } from '../../../src/presentation/budget/budget.controller';
import {  Budgetservice } from '../../../src/presentation/budget/budgets.service';
import { BudgetEntity } from '../../../src/domain';
import { budgets } from './mocks/budgets';  // Supongo que 'budgets' es un mock que contiene datos de presupuestos.

jest.mock('../../../src/domain', () => ({
  BudgetEntity: {
    fromJson: jest.fn((budget) => ({
      id: budget.id,
      name: budget.name,
      amount: budget.amount,
      userId: budget.userId,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
    })),
  },
}));

describe('BudgetController', () => {
  let budgetController: BudgetController;
  let budgetService: Budgetservice;

  beforeAll(() => {
    // Crear una instancia del servicio
    budgetService = new Budgetservice();

    // Crear una instancia del controlador, pasando el servicio mockeado
    budgetController = new BudgetController(budgetService);
  });

  it('should retrieve 3 budgets', async () => {
    // Simular la respuesta del servicio
    jest.spyOn(budgetService, 'getAllBudgets').mockResolvedValue(budgets);

    // Crear una solicitud y una respuesta usando node-mocks-http
    const req = createRequest({
      method: 'GET',
      url: '/api/budget',
      user: { id: '0bb3bc37-7d60-45eb-94ee-877aaed77624' },
    });
    const res = createResponse();

    // Espiar la función json de la respuesta
    const jsonSpy = jest.spyOn(res, 'json');

    // Ejecutar el controlador
    await budgetController.getAllBudgets(req, res);

    // Verificar el estado de la respuesta
    expect(res.statusCode).toBe(200);

    // Verificar que la respuesta contiene los presupuestos correctos
    expect(res._getJSONData()).toEqual(budgets);

    // Verificar q
    expect(jsonSpy).toHaveBeenCalledWith(budgets);
  });

  it('should retrieve 1 budget', async () => {
    // Simular la respuesta del servicio
    jest.spyOn(budgetService, 'getAllBudgets').mockResolvedValue(budgets);

    // Crear una solicitud y una respuesta usando node-mocks-http
    const req = createRequest({
      method: 'GET',
      url: '/api/budget',
      user: { id: 'bf0961aa-37fb-4fd0-bd63-b205fd059c78' },
    });
    const res = createResponse();

    // Espiar la función json de la respuesta
    const jsonSpy = jest.spyOn(res, 'json');

    // Ejecutar el controlador
    await budgetController.getAllBudgets(req, res);

    // Verificar el estado de la respuesta
    expect(res.statusCode).toBe(200);

    // Verificar que la respuesta contiene los presupuestos correctos
    expect(res._getJSONData()).toEqual(budgets);

    // Verificar q
    expect(jsonSpy).toHaveBeenCalledWith(budgets);
  });

  it('should retrieve 0 budget', async () => {
    // Simular la respuesta del servicio
    jest.spyOn(budgetService, 'getAllBudgets').mockResolvedValue(budgets);

    // Crear una solicitud y una respuesta usando node-mocks-http
    const req = createRequest({
      method: 'GET',
      url: '/api/budget',
      user: { id: 'bf0961aa-37fb-4fd0-bd63-b205fd059c79' },
    });
    const res = createResponse();

    // Espiar la función json de la respuesta
    const jsonSpy = jest.spyOn(res, 'json');

    // Ejecutar el controlador
    await budgetController.getAllBudgets(req, res);

    // Verificar el estado de la respuesta
    expect(res.statusCode).toBe(200);

    // Verificar que la respuesta contiene los presupuestos correctos
    expect(res._getJSONData()).toEqual(budgets);

    // Verificar q
    expect(jsonSpy).toHaveBeenCalledWith(budgets);
  });
});
