// How an order can be paid, as the payment step lists it: groups of methods.
// One group and one method today (cryptocurrency, USDC on Solana); a second
// coin is another entry under "crypto", a card processor is another group.
// The ids are what the API accepts as paymentMethod.
export type PaymentMethodId = "usdc_solana";

export type PaymentMethodOption = {
  id: PaymentMethodId;
  label: string; // "USDC on Solana"
  detail: string; // one line under the label
};

export type PaymentGroup = {
  id: string;
  label: string; // "Pay with cryptocurrency"
  detail: string;
  methods: PaymentMethodOption[];
};

export const PAYMENT_GROUPS: PaymentGroup[] = [
  {
    id: "crypto",
    label: "Pay with cryptocurrency",
    detail: "Send the exact amount from your own wallet. No card, no fees from us.",
    methods: [
      {
        id: "usdc_solana",
        label: "USDC on Solana",
        detail: "1 USDC = 1 USD. Paid from any Solana wallet, usually confirmed within a minute.",
      },
    ],
  },
];

export const isPaymentMethodId = (x: unknown): x is PaymentMethodId =>
  PAYMENT_GROUPS.some((g) => g.methods.some((m) => m.id === x));
