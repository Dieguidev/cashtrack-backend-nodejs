import { envs } from '../src/config';
import { Server } from '../src/presentation/server';

jest.mock('../src/presentation/server');

describe('show call server with arguments and start', () => {
  test('Should work', async () => {
    await import('../src/app');

    expect(Server).toHaveBeenCalledTimes(1);
    expect(Server).toHaveBeenCalledWith({
      port: envs.port,
      routes: expect.any(Function)
    });

    expect(Server.prototype.start).toHaveBeenCalledWith();
  });
});
