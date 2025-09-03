describe('Простой тест API сервера', () => {
  it('должен работать', () => {
    expect(1 + 1).toBe(2);
  });

  it('должен иметь доступ к переменным окружения', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });

  it('должен иметь доступ к глобальным утилитам', () => {
    expect(global.testUtils).toBeDefined();
    expect(typeof global.testUtils.generateTestClient).toBe('function');
  });
});
