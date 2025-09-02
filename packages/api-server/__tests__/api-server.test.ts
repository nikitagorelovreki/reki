describe('API Server - Базовые тесты', () => {
  it('должен иметь правильное окружение', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.LOG_LEVEL).toBe('error');
  });

  it('должен иметь доступ к тестовым утилитам', () => {
    expect(global.testUtils).toBeDefined();
    expect(typeof global.testUtils.generateTestClient).toBe('function');
    expect(typeof global.testUtils.generateTestDevice).toBe('function');
    expect(typeof global.testUtils.generateTestForm).toBe('function');
  });

  it('должен генерировать тестовые данные', () => {
    const client = global.testUtils.generateTestClient();
    expect(client.firstName).toBe('Тестовый');
    expect(client.lastName).toBe('Пациент');
    expect(client.status).toBe('active_therapy');

    const device = global.testUtils.generateTestDevice();
    expect(device.model).toBe('Тестовое устройство');
    expect(device.status).toBe('IN_STOCK');
  });
});
