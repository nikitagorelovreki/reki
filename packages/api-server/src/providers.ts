import { Provider } from '@nestjs/common';
import { DEVICE_REPOSITORY, CLIENT_REPOSITORY } from '@cuis/domain';
import { DeviceRepository, ClientRepository } from '@cuis/persistence';

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
