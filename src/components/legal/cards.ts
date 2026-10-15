import {
  ClipboardCheck,
  CreditCard,
  FlaskConical,
  Lock,
  Mail,
  Scale,
  ShieldCheck,
  Truck,
} from "lucide-react";
import type { LegalSection } from "./types";

export const legalSections: LegalSection[] = [
  {
    id: "privacy",
    heading: "Privacy",
    cards: [
      {
        icon: Lock,
        title: "Privacy Policy",
        body: "Bohemia is committed to your privacy. Read our customer Privacy Policy for a clear explanation of how we collect, transfer, and store your information. Learn how to review any information that may be associated with you.",
        link: { label: "Review Our Privacy Policy", href: "/privacy" },
        wide: true,
      },
    ],
  },
  {
    id: "policies",
    heading: "Terms & Policies",
    cards: [
      {
        icon: Scale,
        title: "Terms of Use",
        body: "The agreement that governs your use of the Bohemia website, your account, and every order and group buy placed through it. Please read it before purchasing.",
        link: { label: "Read the Terms of Use", href: "/legal/terms-of-use" },
      },
      {
        icon: Truck,
        title: "Shipping & Returns",
        body: "How orders are packed, shipped, and tracked, what happens when a parcel is delayed or lost, and the conditions under which an order can be returned or replaced.",
        link: {
          label: "Read the Shipping & Returns Policy",
          href: "/policies/shipping-returns",
        },
      },
      {
        icon: CreditCard,
        title: "Payments & Refunds",
        body: "Accepted payment methods, when a charge is captured, and how refunds and group buy settlements are handled when an order is cancelled or a buy does not close.",
        link: { label: "Read the Payments Policy", href: "/policies/payments" },
      },
      {
        icon: FlaskConical,
        title: "Research-Use Disclaimer",
        body: "Every product Bohemia sells is supplied for laboratory research only. Read the full statement on intended use, what we do not claim, and the responsibilities that come with purchasing.",
        link: { label: "Read the Disclaimer", href: "/legal/disclaimer" },
      },
    ],
  },
  {
    id: "ethics",
    heading: "Ethics & Compliance",
    cards: [
      {
        icon: ShieldCheck,
        title: "Ethics & Compliance",
        body: "The standards Bohemia holds itself to: how we source, what we will and will not say about our products, how we protect customers from fraud, and how to report a concern.",
        link: { label: "Read Our Ethics & Compliance Statement", href: "/legal/ethics" },
      },
      {
        icon: ClipboardCheck,
        title: "Testing Standards",
        body: "Which assays every batch goes through, which labs run them, and how to find the certificate of analysis for the exact batch you received.",
        link: { label: "Review Our Testing Standards", href: "/testing/standards" },
      },
    ],
  },
  {
    id: "contact",
    heading: "Contact",
    cards: [
      {
        icon: Mail,
        title: "Contact Us",
        body: "Questions about a policy, a legal notice, or a data request? Reach the Bohemia team directly and we will get back to you.",
        link: { label: "Contact Bohemia", href: "/contact-us" },
        wide: true,
      },
    ],
  },
];
