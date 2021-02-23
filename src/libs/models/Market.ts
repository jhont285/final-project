export interface Market extends MarketInput {
  id: string,
  userId: string,
  invoice?: string,
  createdAt: string,
  updatedAt: string,
}

export interface MarketInput {
  nameMarket: string,
  budget: number,
  currency: string,
  products: Product[],
  done?: boolean,
}

interface Product {
  name: string,
  approximatePrice: number,
  quantity: number,
}

