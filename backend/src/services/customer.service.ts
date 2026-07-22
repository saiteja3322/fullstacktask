import { CustomerRepository } from '../repositories/customer.repository.js';
import { ActivityLogRepository } from '../repositories/activityLog.repository.js';
import { IPaginationQuery } from '../interfaces/query.interface.js';
import { ApiError } from '../utils/apiError.js';
import { MESSAGES } from '../constants/messages.js';

export class CustomerService {
  static async getAll(query: IPaginationQuery) {
    return CustomerRepository.findAll(query);
  }

  static async getById(id: string) {
    const customer = await CustomerRepository.findById(id);
    if (!customer) {
      throw ApiError.notFound(MESSAGES.CUSTOMER.NOT_FOUND);
    }
    return customer;
  }

  static async create(data: any, userId: string) {
    const customer = await CustomerRepository.create(data);
    await ActivityLogRepository.create(userId, `CUSTOMER_CREATED: ${customer.customerName}`, 'CUSTOMER');
    return customer;
  }

  static async update(id: string, data: any, userId: string) {
    await this.getById(id);
    const updated = await CustomerRepository.update(id, data);
    await ActivityLogRepository.create(userId, `CUSTOMER_UPDATED: ${updated.customerName}`, 'CUSTOMER');
    return updated;
  }

  static async delete(id: string, userId: string) {
    const customer = await this.getById(id);
    await CustomerRepository.delete(id);
    await ActivityLogRepository.create(userId, `CUSTOMER_DELETED: ${customer.customerName}`, 'CUSTOMER');
    return true;
  }

  static async updateFollowUp(id: string, followUpDate: Date | null, notes: string, userId: string) {
    await this.getById(id);
    const updated = await CustomerRepository.update(id, { followUpDate, notes });
    await ActivityLogRepository.create(userId, `CUSTOMER_FOLLOWUP_UPDATED: ${id}`, 'CUSTOMER');
    return updated;
  }
}
