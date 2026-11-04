import { redirect } from "next/navigation";

// Orders moved under /order, where the footer points. Kept so old links land.
export default function Page() {
  redirect("/order/list");
}
