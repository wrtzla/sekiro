export interface Character {
  id: string;
  name: string;
  kanji: string;
  role: string;
  shortDescription: string;
  imageKeyword: string; // Used for Picsum
  themeColor: string;
}

export interface LoreResponse {
  lore: string;
  quote: string;
}
