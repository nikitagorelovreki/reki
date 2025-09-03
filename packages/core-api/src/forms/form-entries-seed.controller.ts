import { Controller, Post, Delete, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FormEntriesSeedService } from './seed/form-entries-seed.service';

@Controller('form-entries')
@ApiTags('form-entries')
export class FormEntriesSeedController {
  constructor(private readonly formEntriesSeedService: FormEntriesSeedService) {}

  @Post('seed')
  @ApiOperation({ summary: 'Seed form entries with mock data' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Form entries seeded successfully',
  })
  async seedFormEntries(): Promise<{ message: string }> {
    await this.formEntriesSeedService.seedFormEntries();
    return { message: 'Form entries seeded successfully' };
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear all form entries' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Form entries cleared successfully',
  })
  async clearFormEntries(): Promise<{ message: string }> {
    await this.formEntriesSeedService.clearFormEntries();
    return { message: 'Form entries cleared successfully' };
  }
}
