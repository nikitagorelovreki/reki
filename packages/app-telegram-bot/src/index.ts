import { Context, Telegraf } from 'telegraf';
import { config } from 'dotenv';
import { DeviceStatus } from './types/device.types';
import { ApiService } from './services/ApiService';

// Загружаем переменные окружения
config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');
const apiService = new ApiService();

// Состояния пользователей для регистрации устройств
interface UserState {
  step:
    | 'idle'
    | 'waiting_device_id'
    | 'waiting_location'
    | 'waiting_description';
  deviceId?: string;
  location?: string;
  description?: string;
}

const userStates = new Map<number, UserState>();

// Инициализация состояния пользователя
function initUserState(userId: number): void {
  if (!userStates.has(userId)) {
    userStates.set(userId, { step: 'idle' });
  }
}

// Обработчик команды /start
bot.start(async (ctx: Context) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  initUserState(userId);

  // Проверяем доступность API
  const isApiAvailable = await apiService.healthCheck();

  await ctx.reply(
    '🤖 Добро пожаловать в систему управления медицинскими устройствами Reki!\n\n' +
      'Доступные команды:\n' +
      '/register_device - Зарегистрировать новое устройство\n' +
      '/help - Показать справку\n\n' +
      'Для регистрации устройства нажмите /register_device' +
      (isApiAvailable ? '' : '\n\n⚠️ API сервер недоступен')
  );
});

// Обработчик команды /help
bot.help(async (ctx: Context) => {
  await ctx.reply(
    '📋 Справка по командам:\n\n' +
      '🔧 /register_device - Зарегистрировать новое устройство\n' +
      '📝 /create_ticket - Создать обращение в поддержку\n' +
      '📊 /device_status - Проверить статус устройства\n' +
      '📋 /list_devices - Показать список устройств\n' +
      '❓ /help - Показать эту справку\n\n' +
      'Для начала работы используйте /register_device'
  );
});

// Обработчик команды регистрации устройства
bot.command('register_device', async (ctx: Context) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  initUserState(userId);
  const state = userStates.get(userId)!;
  state.step = 'waiting_device_id';

  await ctx.reply(
    '🔧 Регистрация нового устройства\n\n' +
      'Пожалуйста, введите серийный номер устройства (например: DEV-001-2024):'
  );
});

// Обработчик команды создания обращения
bot.command('create_ticket', async (ctx: Context) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  initUserState(userId);
  const state = userStates.get(userId)!;
  state.step = 'waiting_description';

  await ctx.reply(
    '📝 Создание обращения в поддержку\n\n' + 'Опишите проблему или вопрос:'
  );
});

// Обработчик команды проверки статуса устройства
bot.command('device_status', async (ctx: Context) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  await ctx.reply(
    '📊 Проверка статуса устройства\n\n' +
      'Введите серийный номер устройства для проверки:'
  );
});

// Обработчик команды списка устройств
bot.command('list_devices', async (ctx: Context) => {
  try {
    const devices = await apiService.getAllDevices(1, 5);

    if (!devices.data || devices.data.length === 0) {
      await ctx.reply('📋 Устройств в системе пока нет.');
      return;
    }

    const deviceList = devices.data
      .map(device => `🔧 ${device.serial} - ${device.model} (${device.status})`)
      .join('\n');

    await ctx.reply(
      '📋 Последние устройства в системе:\n\n' +
        deviceList +
        '\n\nДля получения полного списка используйте веб-интерфейс.'
    );
  } catch (error) {
    console.error('Ошибка получения списка устройств:', error);
    await ctx.reply('❌ Не удалось получить список устройств.');
  }
});

// Обработчик текстовых сообщений
bot.on('text', async (ctx: Context) => {
  const userId = ctx.from?.id;
  const text =
    ctx.message && 'text' in ctx.message
      ? (ctx.message as { text: string }).text
      : undefined;

  if (!userId || !text) return;

  initUserState(userId);
  const state = userStates.get(userId)!;

  try {
    switch (state.step) {
      case 'waiting_device_id':
        await handleDeviceIdInput(ctx, text, state);
        break;

      case 'waiting_location':
        await handleLocationInput(ctx, text, state);
        break;

      case 'waiting_description':
        await handleDescriptionInput(ctx, text, state);
        break;

      default:
        // Проверяем, не является ли это запросом статуса устройства
        if (text.match(/^DEV-[\w-]+$/)) {
          await handleDeviceStatusCheck(ctx, text);
        } else {
          await ctx.reply(
            '❓ Не понимаю команду. Используйте /help для справки.'
          );
        }
    }
  } catch (error) {
    console.error('Ошибка обработки сообщения:', error);
    await ctx.reply('❌ Произошла ошибка. Попробуйте еще раз.');
  }
});

// Обработчик ввода ID устройства
async function handleDeviceIdInput(
  ctx: Context,
  deviceId: string,
  state: UserState
) {
  if (!deviceId.match(/^DEV-[\w-]+$/)) {
    await ctx.reply(
      '❌ Неверный формат серийного номера. Используйте формат DEV-XXX-YYYY (например: DEV-001-2024):'
    );
    return;
  }

  // Проверяем, не существует ли уже устройство с таким серийным номером
  try {
    const existingDevice = await apiService.getDeviceBySerial(deviceId);
    if (existingDevice) {
      await ctx.reply(
        `❌ Устройство с серийным номером ${deviceId} уже зарегистрировано в системе.\n` +
          'Используйте другой серийный номер или проверьте статус существующего устройства.'
      );
      return;
    }
  } catch (error) {
    console.error('Ошибка проверки существующего устройства:', error);
  }

  state.deviceId = deviceId;
  state.step = 'waiting_location';

  await ctx.reply(
    '📍 Укажите местонахождение устройства:\n\n' +
      'Например: Кабинет 205, 2 этаж, главный корпус'
  );
}

// Обработчик ввода местоположения
async function handleLocationInput(
  ctx: Context,
  location: string,
  state: UserState
) {
  if (!state.deviceId) {
    await ctx.reply(
      '❌ Ошибка: серийный номер устройства не найден. Начните заново с /register_device'
    );
    return;
  }

  state.location = location;
  state.step = 'idle';

  // Создаем новое устройство через API
  try {
    const deviceData = {
      serial: state.deviceId,
      model: 'Медицинское устройство',
      status: DeviceStatus.REGISTERED,
      currentLocation: location,
      maintenanceNotes: {
        registeredVia: 'telegram_bot',
        registeredBy: ctx.from?.username || 'unknown',
        registrationDate: new Date().toISOString(),
      },
    };

    const device = await apiService.createDevice(deviceData);

    await ctx.reply(
      '✅ Устройство успешно зарегистрировано!\n\n' +
        `📋 Серийный номер: ${device.serial}\n` +
        `🔧 Модель: ${device.model}\n` +
        `📍 Местоположение: ${device.currentLocation}\n` +
        `📊 Статус: ${device.status}\n\n` +
        'Теперь вы можете:\n' +
        '/create_ticket - Создать обращение\n' +
        '/device_status - Проверить статус\n' +
        '/register_device - Зарегистрировать еще одно устройство'
    );

    // Очищаем состояние
    delete state.deviceId;
    delete state.location;
  } catch (error) {
    console.error('Ошибка регистрации устройства:', error);
    
    // Более детальная обработка ошибок
    let errorMessage = '❌ Ошибка при регистрации устройства. ';
    
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        errorMessage += 'Превышено время ожидания ответа от сервера. Проверьте подключение к интернету.';
      } else if (error.message.includes('Network Error') || error.message.includes('ECONNREFUSED')) {
        errorMessage += 'Сервер временно недоступен. Попробуйте позже.';
      } else if (error.message.includes('400')) {
        errorMessage += 'Некорректные данные устройства. Проверьте серийный номер и местоположение.';
      } else if (error.message.includes('409')) {
        errorMessage += 'Устройство с таким серийным номером уже существует.';
      } else {
        errorMessage += 'Попробуйте еще раз или обратитесь к администратору.';
      }
    } else {
      errorMessage += 'Попробуйте еще раз.';
    }
    
    await ctx.reply(errorMessage);
  }
}

// Обработчик ввода описания проблемы
async function handleDescriptionInput(
  ctx: Context,
  description: string,
  state: UserState
) {
  state.description = description;
  state.step = 'idle';

  try {
    // Создаем обращение через API сервис
    const ticket = await apiService.createTicket({
      description: description,
      userId: ctx.from?.id || 0,
      userName: ctx.from?.username || 'unknown',
      ...(state.deviceId ? { deviceId: state.deviceId } : {}),
    });

    await ctx.reply(
      '✅ Обращение в поддержку создано!\n\n' +
        `📝 Описание: ${description}\n` +
        `🆔 Номер обращения: ${ticket.id}\n` +
        `📊 Статус: ${ticket.status}\n\n` +
        'Наши специалисты рассмотрят ваше обращение в ближайшее время.'
    );

    // Очищаем состояние
    delete state.description;
  } catch (error) {
    console.error('Ошибка создания обращения:', error);
    await ctx.reply('❌ Ошибка при создании обращения. Попробуйте еще раз.');
  }
}

// Обработчик проверки статуса устройства
async function handleDeviceStatusCheck(ctx: Context, deviceId: string) {
  try {
    const device = await apiService.getDeviceBySerial(deviceId);

    if (!device) {
      await ctx.reply(
        `❌ Устройство ${deviceId} не найдено в системе.\n` +
          'Возможно, оно еще не зарегистрировано.'
      );
      return;
    }

    const statusEmoji =
      device.status === DeviceStatus.ACTIVE ||
      device.status === DeviceStatus.REGISTERED
        ? '✅'
        : '⚠️';

    await ctx.reply(
      `📊 Статус устройства ${device.serial}:\n\n` +
        `🔧 Модель: ${device.model}\n` +
        `📊 Статус: ${device.status}\n` +
        `📍 Местоположение: ${device.currentLocation || 'Не указано'}\n` +
        `📅 Последняя активность: ${device.lastSeenAt?.toLocaleString() || 'Неизвестно'}\n` +
        `${statusEmoji} ${
          device.status === DeviceStatus.ACTIVE ||
          device.status === DeviceStatus.REGISTERED
            ? 'Все системы работают нормально'
            : 'Требует внимания'
        }`
    );
  } catch (error) {
    console.error('Ошибка проверки статуса:', error);
    await ctx.reply('❌ Ошибка при проверке статуса устройства.');
  }
}

// Обработчик ошибок
bot.catch((err: any, ctx: Context) => {
  console.error('Ошибка бота:', err);
  ctx.reply('❌ Произошла ошибка. Попробуйте позже.');
});

// Запуск бота
async function startBot() {
  try {
    console.log('🤖 Запуск Telegram бота...');

    // Проверяем доступность API сервера
    const isApiAvailable = await apiService.healthCheck();
    if (!isApiAvailable) {
      console.warn(
        '⚠️ API сервер недоступен. Бот будет работать в ограниченном режиме.'
      );
    }

    await bot.launch();
    console.log('✅ Telegram бот запущен успешно!');

    // Graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  } catch (error) {
    console.error('❌ Ошибка запуска бота:', error);
    process.exit(1);
  }
}

// Запускаем бота если файл запущен напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
  startBot();
}

export { bot, startBot };
