import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import {
  ASTROLOGY_REPORT_JOB_NAME,
  ASTROLOGY_REPORT_QUEUE_NAME,
} from 'processors/queue.constants';

@Processor(ASTROLOGY_REPORT_QUEUE_NAME)
@Injectable()
export class AstrologyReportProcessor {
  private readonly logger = new Logger(AstrologyReportProcessor.name);

  @Process(ASTROLOGY_REPORT_JOB_NAME)
  async handleAstrologyReport(job: Job<{ userId: number; offerId: number }>) {
    this.logger.log(`sending astrology report`);

    try {
      const response = await axios.post(
        'https://run.mocky.io/v3/ce5e6920-4fa4-451f-be82-efd3b1dc170a',
        {
          userId: job.data.userId,
          offerId: job.data.offerId,
        },
      );

      this.logger.log('astrology report sent successfully');
    } catch (error) {
      this.logger.error(`failed to send astrology report: ${error.message}`);
    }
  }
}
