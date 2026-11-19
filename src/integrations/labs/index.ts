import { chromate } from "./chromate";
import { freedom } from "./freedom";
import { janoshik } from "./janoshik";

export type Lab = {
  name: string;
  logo: string;
  logoSize: { width: number; height: number };
  logoHeight: number;
  logoOffset?: number;
  invertLogo?: boolean;
  background: string;
  text: string;
  font: string;
};

const labs: Lab[] = [janoshik, freedom, chromate];

export function findLab(name: string): Lab | undefined {
  return labs.find((lab) => lab.name === name);
}
