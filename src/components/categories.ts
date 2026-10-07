export const category = {
  pizza: "Пиццы",
  breakfast: "Завтраки",
  wings: "Крылышки",
  milkshake: "Милкшейки",
} as const;

export type CategoryKey = keyof typeof category;
export const categoryKeys = Object.keys(category) as CategoryKey[];
