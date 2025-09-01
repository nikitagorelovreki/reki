import { Provider } from '@nestjs/common';
import { CLIENT_REPOSITORY, DEVICE_REPOSITORY } from '@reki/domain';
import { ClientRepository, DeviceRepository } from '@reki/persistence';

// Providers для связывания портов с их реализациями
export const providers: Provider[] = [
  {
    provide: DEVICE_REPOSITORY,
    useExisting: DeviceRepository,
  },
  {
    provide: CLIENT_REPOSITORY,
    useExisting: ClientRepository,
  },
];
