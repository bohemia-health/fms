"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FloatingInput } from "@asclepius/ui";
import { authClient } from "@/lib/auth-client";
import { AUTH_URL } from "@/lib/auth-site";
import { CAPTCHA_ENABLED, Captcha, captchaHeaders } from "@/components/captcha";
import { continueAsGuest } from "@/app/checkout/actions";
import BagButton from "@/components/bag/BagButton";

// The fork a guest meets on the way to checkout: sign in here, or carry on
// without an account. Sign-in posts to Asclepius through the Better Auth
// client, which sets the session cookie; /checkout then re-runs its gate
// with that cookie and lets them through.
export default function CheckoutGate() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [captcha, setCaptcha] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    const { error } = await authClient.signIn.email({
      fetchOptions: captchaHeaders(captcha),
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    setPending(false);
    if (error) {
      setError(
        error.status === 401 || error.status === 403
          ? "That email and password don't match."
          : (error.message ?? "Sign in failed. Try again."),
      );
      return;
    }
    // Same URL: the page re-runs its gate with the new cookie.
    router.refresh();
  }

  return (
    <div className="grid gap-12 py-16 md:grid-cols-2 md:gap-0 md:py-24">
      {/* Sign in */}
      <section className="flex flex-col md:border-r md:border-foreground/15 md:pr-16">
        <h1 className="text-[1.75rem] font-semibold tracking-tight md:text-[2rem]">
          Sign in for faster checkout.
        </h1>
        <p className="mt-2 text-muted-foreground">
          Sign in to your Bohemia account.
        </p>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3">
          <FloatingInput
            id="email"
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            required
          />
          <FloatingInput
            id="password"
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            required
          />
          <p className="text-right text-sm">
            <a
              href={`${AUTH_URL}/forgot-password`}
              className="text-[#0065CC] hover:underline"
            >
              Forgot password?
            </a>
          </p>

          <Captcha onToken={setCaptcha} />

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <BagButton
            label={pending ? "Signing in…" : "Sign In"}
            className="mt-2"
            disabled={pending || (CAPTCHA_ENABLED && !captcha)}
          />
        </form>
      </section>

      {/* Guest */}
      <section className="flex flex-col md:pl-16">
        <h2 className="text-[1.75rem] font-semibold tracking-tight md:text-[2rem]">
          Guest Checkout
        </h2>
        <p className="mt-2 text-muted-foreground">
          You can create an account after you place your order.
        </p>
        <form action={continueAsGuest} className="mt-8">
          <BagButton
            label="Continue as Guest"
            className="bg-foreground text-background hover:bg-foreground/90"
          />
        </form>
      </section>
    </div>
  );
}
