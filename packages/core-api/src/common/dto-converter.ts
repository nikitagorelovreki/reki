/**
 * Конвертирует типы данных в DTO (например, строковые даты в объекты Date)
 */
export function convertDtoTypes<T>(dto: T): Partial<T> {
  const converted: Partial<T> = { ...dto };

  for (const key in converted) {
    if (Object.prototype.hasOwnProperty.call(converted, key)) {
      const value = converted[key];
      // Конвертируем ISO строки дат в объекты Date
      if (typeof value === 'string') {
        // Проверяем ISO формат даты
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)) {
          converted[key] = new Date(value) as any;
        }
        // Проверяем формат даты YYYY-MM-DD
        else if (/^\d{4}-\d{2}-\d{2}$/.test(value) && key.toLowerCase().includes('date') || key === 'warrantyUntil') {
          converted[key] = new Date(value) as any;
        }
      }
    }
  }
  
  return converted;
}
