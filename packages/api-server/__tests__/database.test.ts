describe('Database - Базовые тесты', () => {
  it('должен иметь тестовую базу данных', () => {
    // Проверяем, что переменные окружения загружены
    expect(process.env.NODE_ENV).toBe('test');
  });

  it('должен иметь функции очистки данных', () => {
    expect(typeof global.testUtils.cleanupTestData).toBe('function');
  });

  it('должен иметь функции ожидания', () => {
    expect(typeof global.testUtils.wait).toBe('function');
  });
});
