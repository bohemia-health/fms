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

// The group buy an item is sold through, when it is. Such a line is a
// pre-order: it ships in the campaign's window, not from stock.
export type BagCampaign = {
  id: string;
  title: string;
  shipsInWeeksMin: number | null;
  shipsInWeeksMax: number | null;
};

export type BagLine = {
  itemId: string;
  itemCodeId: string | null; // the product this size variant belongs to
  slug: string | null; // /shop/<slug>, null if the item has no product yet
  campaign: BagCampaign | null;
  image: string | null;
  name: string;
  size: string;
  form: string;
  quantity: number;
  price: number; // unit price in dollars
  batches: BagBatch[];
};
