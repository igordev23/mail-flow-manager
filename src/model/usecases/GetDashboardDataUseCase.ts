// Model Layer - Get Dashboard Data UseCase

import { Email, DashboardData } from '@/model/entities';
import { EmailService } from '@/model/services';

export class GetDashboardDataUseCase {
  execute(emails: Email[]): DashboardData {
    return EmailService.calculateDashboardData(emails);
  }
}
