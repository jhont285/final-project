import {Market, MarketInput} from "@libs/models/Market";
import {UploadURL} from "@libs/models/UploadURL";

export interface BusinessLogic {
  create(movie: MarketInput, userId: string): Promise<Market>;
  getAll(userId: string): Promise<Market[]>;
  update(movie: MarketInput, userId: string, marketId: string): Promise<Market>;
  updateImage(userId: string, todoId: string): Promise<UploadURL>;
  delete(userId: string, marketId: string): Promise<boolean>;
  getById(userId: string, marketId: string): Promise<Market>;
}