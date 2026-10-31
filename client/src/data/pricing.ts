// Pricing catalog shared by the pricing page and the checkout page.
// All display strings come from the i18n dictionary via `pricing.<id>.*` keys.

export interface PricingItem {
  id: string;
  type: "product" | "service";
  icon: string; // lucide icon name registered in PricingPage's icon map
}

export const productItems: PricingItem[] = [
  { id: "p1", type: "product", icon: "Monitor" },
  { id: "p2", type: "product", icon: "Laptop" },
  { id: "p3", type: "product", icon: "GraduationCap" }
];

export const serviceItems: PricingItem[] = [
  { id: "s1", type: "service", icon: "Disc" },
  { id: "s2", type: "service", icon: "Fan" },
  { id: "s3", type: "service", icon: "Car" },
  { id: "s4", type: "service", icon: "HardDriveDownload" },
  { id: "s5", type: "service", icon: "Cctv" },
  { id: "s6", type: "service", icon: "Wifi" },
  { id: "s7", type: "service", icon: "Cpu" },
  { id: "s8", type: "service", icon: "Printer" }
];

export const allPricingItems: PricingItem[] = [...productItems, ...serviceItems];

export function findPricingItem(id: string | null): PricingItem | undefined {
  return allPricingItems.find((item) => item.id === id);
}
