export interface Product {
  id?: number;
  name: string;
  state: string;
  zip: string;
  amount: number;
  qty: number;
  item: string;

  isNew?:boolean;
}
