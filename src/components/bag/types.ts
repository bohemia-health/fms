export type BagLine = {
  itemId: string;
  image: string | null;
  name: string;
  size: string;
  form: string;
  quantity: number;
  price: number; // unit price in dollars
};
