import { Role } from '@prisma/client';

export { Role };

export const ROLES = {
  ADMIN: Role.ADMIN,
  SALES: Role.SALES,
  WAREHOUSE: Role.WAREHOUSE,
  ACCOUNTS: Role.ACCOUNTS,
};
