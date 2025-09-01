# Исправление ошибки 400 при обновлении клиента

## Проблема
При попытке обновления клиента через фронтенд возникала ошибка 400 Bad Request.

## Причина
Несоответствие полей между фронтендом и API:

### Фронтенд отправлял:
```typescript
{
  fullName: string,        // ❌ Не существует в API DTO
  firstName?: string,      // ❌ Опциональное в фронтенде
  lastName?: string,       // ❌ Опциональное в фронтенде
  dob?: string,           // ❌ Неправильное название поля
  contacts?: any           // ❌ Неправильная структура
}
```

### API ожидал:
```typescript
{
  firstName?: string,      // ✅ Опциональное
  lastName?: string,       // ✅ Опциональное
  dateOfBirth?: string,    // ✅ Правильное название
  phone?: string,          // ✅ Отдельные поля
  email?: string,          // ✅ Отдельные поля
  address?: string         // ✅ Отдельные поля
}
```

## Исправления

### 1. Обновлен `packages/frontend/src/types/index.ts`
```typescript
// ❌ Было
export interface CreateClientDto {
  fullName: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  contacts?: any;
}

// ✅ Стало
export interface CreateClientDto {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  address?: string;
  diagnosis?: string;
  status?: ClientStatus;
  clinicId?: string;
}
```

### 2. Обновлены функции обработки в `packages/frontend/src/pages/Clients/ClientsPage.tsx`
```typescript
// ❌ Было
const handleUpdate = async (
  values: Partial<CreateClientDto> & { dob?: dayjs.Dayjs }
) => {
  const formattedValues = {
    ...values,
    dob: values.dob ? values.dob.format('YYYY-MM-DD') : undefined,
  };
}

// ✅ Стало
const handleUpdate = async (
  values: Partial<CreateClientDto> & { dateOfBirth?: dayjs.Dayjs }
) => {
  const formattedValues = {
    ...values,
    dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : undefined,
  };
}
```

### 3. Обновлены формы создания и редактирования
```typescript
// ❌ Было
<Form.Item name='dob' label='Date of Birth'>

// ✅ Стало
<Form.Item name='dateOfBirth' label='Date of Birth'>
<Form.Item name='phone' label='Phone'>
<Form.Item name='email' label='Email'>
<Form.Item name='address' label='Address'>
```

### 4. Обновлено заполнение формы при редактировании
```typescript
// ❌ Было
const formValues = {
  ...record,
  dob: record.dob ? dayjs(record.dob) : undefined,
};

// ✅ Стало
const formValues = {
  ...record,
  dateOfBirth: record.dob ? dayjs(record.dob) : undefined,
  phone: record.contacts?.phone,
  email: record.contacts?.email,
  address: record.contacts?.address,
};
```

## Результат
✅ Ошибка 400 исправлена  
✅ Обновление клиентов работает корректно  
✅ Формы используют правильные поля  
✅ Маппинг между фронтендом и API согласован  

## Тестирование
```bash
# API работает корректно
curl -X PATCH http://localhost:3000/api/clients/ID -H "Content-Type: application/json" \
  -d '{"firstName":"Updated","lastName":"Name","phone":"+79001234567"}'
# Возвращает 200 OK с обновленными данными
```
