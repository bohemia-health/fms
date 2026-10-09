const megaFooterLinks = [
  {
    heading: "Shop and Learn",
    links: [
      { label: "Store", href: "/shop" },
      { label: "Group Buys", href: "/group_buys" },
      { label: "Retatrutide", href: "/shop/retatrutide" },
      { label: "Tirzepatide", href: "/shop/tirzepatide" },
      { label: "Semaglutide", href: "/shop/semaglutide" },
      { label: "Mito", href: "/shop/mito" },
      { label: "Nootropic", href: "/shop/nootropic" },
      { label: "Bioregulator", href: "/shop/bioregulator" },
      { label: "Accessories", href: "/shop/accessories" },
      { label: "Gift Cards", href: "/shop/giftcards" },
    ],
  },

  {
    heading: "Account",
    links: [
      { label: "Manage Your Account", href: "/account" },
      { label: "Order Status", href: "/order/status" },
    ],
  },
  {
    heading: "For Users",
    links: [
      { label: "Contact Support", href: "/support" },
      { label: "Shopping Help", href: "/faq" },
      { label: "Repository", href: "/repository" },
      { label: "Find a COA", href: "/repository/lab_reports" },
    ],
  },

  {
    heading: "Values",
    links: [
      { label: "Science", href: "/science" },
      { label: "Technology", href: "/technology" },
      { label: "Environment", href: "/environment" },
      { label: "Inclusion and Diversity", href: "/inclusion-and-diversity" },
      { label: "Supply Chain Innovation", href: "/supplychain-innovation" },
    ],
  },

  {
    heading: "About Bohemia",
    links: [
      { label: "Newsroom", href: "/news" },
      { label: "Leadership", href: "/ethics-compliance" },
      { label: "Career Opportunities", href: "/privacy" },
      { label: "Investors", href: "/cookies" },
      { label: "Ethics & Compliance", href: "/tos" },
      { label: "Events", href: "/code-of-conduct" },
      { label: "Contact Bohemia", href: "/contact-us" },
    ],
  },
];

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterGroup = {
  heading: string;
  links: FooterLink[];
};

export type FooterColumn = FooterGroup[];
