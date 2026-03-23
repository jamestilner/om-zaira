/**
 * Product Categories and Subcategories
 * Based on jewelry product classification
 */

export interface CategoryData {
  [key: string]: string[];
}

export const PRODUCT_CATEGORIES: CategoryData = {
  'Earrings': [
    'Studs',
    'Hoops',
    'Dangles',
    'Ear cuffs',
    'Huggies',
  ],
  'Necklaces': [
    'Chains',
    'Pendants',
    'Chokers',
    'Lariats',
    'Statement necklaces',
  ],
  'Bracelets': [
    'Bangles',
    'Cuffs',
    'Charm bracelets',
    'Tennis bracelets',
    'Beaded bracelets',
  ],
  'Rings': [
    'Engagement rings',
    'Wedding bands',
    'Dangles',
    'Cocktail rings',
    'Stackable rings',
  ],
  'Brooches': [
    'Vintage brooches',
    'Floral brooches',
    'Animal brooches',
    'Statement brooches',
  ],
  'Anklets': [
    'Chain anklets',
    'Beaded anklets',
    'Charm anklets',
  ],
};

// Get all category names
export const getCategoryNames = (): string[] => {
  return Object.keys(PRODUCT_CATEGORIES);
};

// Get subcategories for a specific category
export const getSubcategories = (category: string): string[] => {
  return PRODUCT_CATEGORIES[category] || [];
};