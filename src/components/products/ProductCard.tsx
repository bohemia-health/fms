import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";

type ProductCardProps = {
  title: string;
};

export default function ProductCard({ title }: ProductCardProps) {
  return (
    <Card
      size="default"
      className="relative flex w-full max-w-xs gap-0 rounded-[18px] bg-card ring-0 shadow-[2px_4px_12px_rgba(0,0,0,0.08)] transition hover:scale-[1.01] hover:shadow-[2px_4px_16px_rgba(0,0,0,0.16)] dark:shadow-none"
    >
      <Image
        src="/product-image.png"
        alt="product image"
        width={600}
        height={600}
        className="mx-auto mt-6 aspect-square w-3/5 rounded-lg object-cover"
      />

      <CardHeader className="pt-12 px-8">
        <CardTitle className="grid gap-1.75">
          <span className="font-light text-xs text-indigo-500">New</span>
          <span className="text-[0.96rem] font-medium tracking-[0.030rem] leading-5.5">
            {title}
          </span>
        </CardTitle>
      </CardHeader>

      <CardFooter className="border-0 bg-card shadow-md pt-6 pb-7.5 px-8">
        <p className="font-thin text-[0.820rem] tracking-wide">$59.00</p>
      </CardFooter>
    </Card>
  );
}
