import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import {
  ANALYTICS_REPORT_JOB_NAME,
  ANALYTICS_REPORT_QUEUE_NAME,
} from 'processors/queue.constants';

@Processor(ANALYTICS_REPORT_QUEUE_NAME)
@Injectable()
export class AnalyticsReportProcessor {
  private readonly logger = new Logger(AnalyticsReportProcessor.name);

  @Process(ANALYTICS_REPORT_JOB_NAME)
  async handleAnalyticsReport(job: Job<{ userId: number; offerId: number }>) {
    this.logger.log(`sending analytics report`);
    try {
      const response = await axios.post(
        'https://run.mocky.io/v3/ce5e6920-4fa4-451f-be82-efd3b1dc170a',
        {
          userId: job.data.userId,
          offerId: job.data.offerId,
        },
      );

      this.logger.log('analytics report sent successfully');
    } catch (error) {
      this.logger.error(`failed to send analytics report: ${error.message}`);
    }
  }
}
