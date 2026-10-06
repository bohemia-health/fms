"use client";
import { motion } from "motion/react";
import { useState, useEffect, useMemo } from "react";

export function HeroText() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["middleman", "liaison", "intermediary", "go-between", "stress"],
    [],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);
  return (
    <h1 className="mx-auto max-w-3xl text-6xl font-semibold tracking-tight text-foreground md:text-9xl">
      <span>Cut out the</span>
      <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
        &nbsp;
        {titles.map((title, index) => (
          <motion.span
            key={index}
            className="absolute"
            initial={{ opacity: 0, y: -100 }}
            transition={{ type: "spring", stiffness: 50 }}
            animate={
              titleNumber === index
                ? { y: 0, opacity: 1 }
                : { y: titleNumber > index ? -150 : 150, opacity: 0 }
            }
          >
            {title}
          </motion.span>
        ))}
      </span>
    </h1>
  );
}
