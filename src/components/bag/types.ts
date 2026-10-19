export type BagCoa = {
  id: string;
  rank: number; // position in the house order of report types
  label: string; // test type as printed on the report, e.g. "Mass Purity"
  url: string;
};

export type BagBatch = {
  id: number;
  number: string; // batch_number, e.g. "RE30-0416"
  vendor: string; // manufacturer short name
  cap: string | null;
  crimp: string | null;
  coas: BagCoa[]; // every lab report on file for this batch
};

export type BagLine = {
  itemId: string;
  itemCodeId: string | null; // the product this size variant belongs to
  image: string | null;
  name: string;
  size: string;
  form: string;
  quantity: number;
  price: number; // unit price in dollars
  batches: BagBatch[];
};
