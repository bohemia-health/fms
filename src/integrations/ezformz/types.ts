export interface EzformzOrderItem {
  product_id: string;
  productName: string;
  optionLabel: string;
  price: number;
  quantity: number;
}

export interface EzformzShippingAddress {
  street: string;
  street2: string;
  city: string;
  state_province: string;
  postal_code: string;
  country_code: string;
}

export interface EzformzOrder {
  id: string;
  form_id: string;
  customer_name: string;
  customer_email: string;
  shipping_address: EzformzShippingAddress;
  order_items: {
    items: EzformzOrderItem[];
  };
}

export interface EzformzPagination {
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

export interface EzformzListResponse {
  data: EzformzOrder[];
  pagination: EzformzPagination;
}
