import { ActivityLogRepository } from '../repositories/activityLog.repository.js';
import { IPaginationQuery } from '../interfaces/query.interface.js';

export class ActivityLogService {
  static async getAll(query: IPaginationQuery) {
    return ActivityLogRepository.findAll(query);
  }
}
