"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { paymentStatus, type PaymentView } from "@/app/checkout/actions";

const POLL_MS = 10_000;

// The pay screen for USDC on Solana. The address and amount are the primary
// path: some wallets (Exodus Mobile among them) refuse the Solana Pay QR for
// USDC, so the QR is offered second. Polls the API while the payment is
// open and switches to the paid state the moment Stablehand reports it.
export default function PayWithUsdc({
  initial,
  qrSvg,
}: {
  initial: PaymentView;
  qrSvg: string | null;
}) {
  const [payment, setPayment] = useState(initial);
  const pending = payment.status === "open" || payment.status === "underpaid";

  useEffect(() => {
    if (!pending) return;
    const id = setInterval(async () => {
      const next = await paymentStatus(payment.orderNumber).catch(() => null);
      if (next) setPayment(next);
    }, POLL_MS);
    return () => clearInterval(id);
  }, [pending, payment.orderNumber]);

  if (payment.status === "paid") {
    return (
      <div className="flex flex-col items-start gap-6 max-w-2xl">
        <h1 className="text-[2.55rem] font-medium">Payment received. Thank you.</h1>
        <p className="text-lg">
          Your order <span className="font-medium tabular-nums">{payment.orderNumber}</span> is
          placed and on its way to our warehouse team. A receipt is on its way to your email.
        </p>
        <Link href={`/orders/${payment.orderNumber}`} className="text-[#0065CC] underline">
          View your order
        </Link>
      </div>
    );
  }

  if (payment.status === "expired" || payment.status === "cancelled") {
    return (
      <div className="flex flex-col items-start gap-6 max-w-2xl">
        <h1 className="text-[2.55rem] font-medium">
          {payment.status === "expired" ? "This payment window has closed." : "This order was cancelled."}
        </h1>
        <p className="text-lg">
          Payment <span className="font-medium tabular-nums">{payment.orderNumber}</span> is no
          longer open and no order was placed. If you already sent funds, they are refunded to
          the wallet they came from. Your bag is as you left it, so you can start again.
        </p>
        <Link href="/bag" className="text-[#0065CC] underline">
          Back to your bag
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-12 md:grid-cols-[1fr_20rem] md:items-start">
      <div className="flex flex-col gap-8 max-w-2xl">
        <div>
          <h1 className="text-[2.55rem] font-medium">Send your payment</h1>
          <p className="mt-2 text-muted-foreground">
            Reference <span className="tabular-nums">{payment.orderNumber}</span>
            {" · "}
            <Countdown expiresAt={payment.expiresAt} />
          </p>
        </div>

        {payment.status === "underpaid" && (
          <p role="status" className="rounded-lg bg-amber-50 px-5 py-4 text-amber-900">
            We received part of your payment. Send the remaining USDC to the same address and
            the order completes on its own.
          </p>
        )}

        <Field label="Amount, in USDC on Solana" value={payment.amount} display={`${payment.amount} USDC`} />
        <Field label="Send to this address" value={payment.address} mono />

        <ol className="list-decimal space-y-2 pl-5 text-[1.05rem]">
          <li>Open your Solana wallet and choose Send.</li>
          <li>Pick USDC, paste the address above, and enter the exact amount.</li>
          <li>
            Confirm. This page updates by itself once the payment lands, usually within a
            minute, and that is when your order is placed.
          </li>
        </ol>

        <p className="text-[0.9rem] text-muted-foreground">
          Send USDC on the Solana network only. Within a few dollars either way still counts as
          paid; a larger shortfall holds the order until the rest arrives.
        </p>
      </div>

      <aside className="flex flex-col items-center gap-4 rounded-lg ring-1 ring-foreground/15 p-6">
        <h2 className="font-medium">Or scan with your wallet</h2>
        {qrSvg ? (
          // eslint-disable-next-line @next/next/no-img-element -- inline SVG data URL
          <img
            src={`data:image/svg+xml;base64,${btoa(qrSvg)}`}
            alt="Solana Pay QR code for this payment"
            width={224}
            height={224}
            className="size-56"
          />
        ) : (
          <p className="text-sm text-muted-foreground">QR code unavailable; use the address above.</p>
        )}
        <a href={payment.paymentUrl} className="text-[#0065CC] underline text-sm">
          Open in a wallet on this device
        </a>
        <p className="text-[0.8rem] text-muted-foreground text-center">
          Some wallets can&apos;t read this code for USDC (Exodus Mobile shows
          &ldquo;unsupported token&rdquo;). If that happens, copy the address and amount instead.
        </p>
      </aside>
    </div>
  );
}

// A value with a copy button. Plain text, selectable, so it also works
// without the clipboard API.
function Field({
  label,
  value,
  display,
  mono,
}: {
  label: string;
  value: string;
  display?: string;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[0.9rem] text-muted-foreground">{label}</p>
      <div className="flex items-center gap-3 rounded-lg ring-1 ring-foreground/20 px-5 py-4">
        <span className={cn("grow break-all text-[1.1rem] select-all", mono && "font-mono text-[0.95rem]")}>
          {display ?? value}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={`Copy ${label.toLowerCase()}`}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(value);
              setCopied(true);
            } catch {
              // No clipboard access: the text is select-all, so a long press still works.
            }
          }}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  );
}

// "Expires in 23h 58m", ticking each minute.
function Countdown({ expiresAt }: { expiresAt: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);
  const left = Math.max(0, new Date(expiresAt).getTime() - now);
  const h = Math.floor(left / 3_600_000);
  const m = Math.floor((left % 3_600_000) / 60_000);
  if (left === 0) return <span>payment window closing</span>;
  return (
    <span>
      expires in {h > 0 ? `${h}h ` : ""}
      {m}m
    </span>
  );
}
