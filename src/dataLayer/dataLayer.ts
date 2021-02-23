import {Market} from "@libs/models/Market";

export interface DataLayer {
  create(market: Market): Promise<Market>;
  getAll(userId: string): Promise<Market[]>;
  delete(userId: string, marketId: string): Promise<boolean>;
  getById(userId: string, marketId: string): Promise<Market>;
}
