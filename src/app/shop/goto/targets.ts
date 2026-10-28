// Short, stable links the footer and other sites can point at, resolved to
// wherever the page lives today. Keys are the path after /shop/goto/, so
// "business/faq" is one key. Edit the right-hand side freely; the keys are
// the contract. Anything not here is a 404, not a guess.
export const shopGoto: Record<string, string> = {
  glp1: "/shop/glp1",
  help: "/contact-us",
  "order/list": "/orders/list",
  bulk: "/campaign",
  business: "/contact-us",
  "business/faq": "/contact-us",
  // Stuart (the Telegram bot) has no page yet; the store's "Ask Stuart"
  // tiles all go through here so one line moves them when it does.
  stuart: "/contact-us",
};

export const repositoryGoto: Record<string, string> = {
  search: "/repository",
};
