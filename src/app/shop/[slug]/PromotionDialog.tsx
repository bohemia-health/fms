"use client";

import Image from "next/image";
import Link from "next/link";
import ProductBadge from "@/components/products/ProductBadge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpRight } from "@/components/icons/arrow-up-right";

// The "Save up to 25%" badge in the product header and the sheet it opens:
// Apple's trade-in sheet shape with the quantity tiers and the stablecoin
// bonus. Static copy for now; the promotions table will feed it.
export default function PromotionDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <ProductBadge
            label="Save up to 25% when purchasing more."
            className="min-h-11 w-full justify-start whitespace-normal rounded-xl border border-foreground/10 bg-transparent px-4 py-3 text-left font-sans text-[13px] leading-5 font-normal text-muted-foreground hover:border-foreground/25 focus-visible:outline-2 focus-visible:outline-offset-4"
          />
        }
      />

      <DialogContent
        align="top"
        className="max-w-[min(51rem,calc(100%-2rem))] sm:max-w-[min(51rem,calc(100%-2rem))] [--dialog-px:clamp(1.5rem,8vw,4.75rem)] [--dialog-py:clamp(2.5rem,7.5vw,4.75rem)]"
      >
        <div className="flex flex-col gap-4">
          <h1 className="text-[clamp(1.75rem,6.5vw,2.55rem)] leading-[1.1] font-medium tracking-tight">
            Save more when purchasing more.
          </h1>
          <p className="text-[1.05rem] leading-[1.5] max-w-2xl">
            Just add two or more qualifying items to your order to receive a
            discount. We’ll apply your savings at checkout. Checkout using
            Stablecoin and receive an additional 5% off, up to 25%. Terms apply
          </p>
        </div>

        <Table className="mt-10" containerClassName="min-w-0 overflow-visible">
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="h-auto px-0 pb-3 text-sm font-normal whitespace-normal">
                Items in your order
              </TableHead>
              <TableHead className="text-right h-auto px-0 pb-3 text-sm font-normal whitespace-normal">
                Your discount
                <span className="align-super text-[0.60rem] font-light">◊</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&>tr:first-child>td]:pt-6">
            <TableRow className="border-border hover:bg-transparent">
              <TableCell className="px-0 py-3 text-[1.3rem] font-semibold">
                2 items
              </TableCell>
              <TableCell className="text-right px-0 py-3 text-[1.3rem] font-semibold">
                Save 5%
                <span className="block text-xs font-normal text-muted-foreground">
                  10% with stablecoin
                </span>
              </TableCell>
            </TableRow>

            <TableRow className="border-border hover:bg-transparent">
              <TableCell className="px-0 py-3 text-[1.3rem] font-semibold">
                3 items
              </TableCell>
              <TableCell className="text-right px-0 py-3 text-[1.3rem] font-semibold">
                Save 10%
                <span className="block text-xs font-normal text-muted-foreground">
                  15% with stablecoin
                </span>
              </TableCell>
            </TableRow>

            <TableRow className="border-border hover:bg-transparent">
              <TableCell className="px-0 py-3 text-[1.3rem] font-semibold">
                4 items
              </TableCell>

              <TableCell className="text-right px-0 py-3 text-[1.3rem] font-semibold">
                Save 15%
                <span className="block text-xs font-normal text-muted-foreground">
                  20% with stablecoin
                </span>
              </TableCell>
            </TableRow>

            <TableRow className="border-border hover:bg-transparent">
              <TableCell className="px-0 py-3 text-[1.3rem] font-semibold">
                5 or more items
              </TableCell>

              <TableCell className="text-right px-0 py-3 text-[1.3rem] font-semibold">
                Save 20%
                <span className="block text-xs font-normal text-muted-foreground">
                  25% with stablecoin
                </span>
              </TableCell>
            </TableRow>
          </TableBody>

          <TableCaption className="mt-8 text-left text-xs leading-4">
            ◊ Discount will vary based on the configuration of a qualifying
            order. Additional 5% discount for orders only includes those paid
            with USD Coin (USDC) and Tether (USDT) on Solana (SOL) and Ethereum
            (ERC-20). The total value of your savings will be calculated and
            applied automatically at checkout. This offer cannot be applied
            retroactively. Not all items are eligible. Eligible items can be
            combined in a qualifying order to meet offer requirements. Sales tax
            may be assessed on the full value of promotional items in your
            order. Offer may not be available to all customers. You must be at
            least the age of majority and a qualifying customer to participate
            in this offer. View more information regarding this offer at{" "}
            <span>
              <Link
                href="https://www.bhmhlth.com/promotions/"
                className="underline"
              >
                https://www.bhmhlth.com/promotions/.
              </Link>
            </span>{" "}
            Bohemia Health reserves the right to refuse, cancel, or limit this
            offer for any reason. Restrictions and limitations may apply.
          </TableCaption>
        </Table>

        <DialogFooter className="flex flex-col max-w-none! mt-11 items-center bg-muted pt-1 pb-[18px] text-center text-xs leading-4 sm:justify-center">
          <div>
            <Image
              src="/specialist-chat-image.png"
              alt=""
              width={56}
              height={56}
              className="mx-auto mb-1 size-[clamp(2rem,5vw,2.75rem)] rounded-full bg-background object-cover"
            />
            <p className="font-semibold">Have more questions?</p>

            <div className="inline-flex underline">
              Contact a Specialist{" "}
              <ArrowUpRight className="h-5 w-5 -translate-x-0.5 -translate-y-0.25" />
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
