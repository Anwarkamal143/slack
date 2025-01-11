import { CookieOptions } from "express";

export const DB_URL = process.env.DB_URL || "";
export const PORT = process.env.PORT || 4000;
export const JWT_SECRET =
  process.env.JWT_SECRET || "xLDL9bqmNO=PI9Q5O`+#GnGFTukFKl";

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "90d";
export const JWT_COOKIE_EXPIRES_IN = Number(
  process.env.JWT_COOKIE_EXPIRES_IN || "90"
);
export const COOKIE_NAME = process.env.COOKIE_NAME || "slack_jwt";
export const REFRESH_COOKIE_NAME =
  process.env.REFRESH_COOKIE_NAME || "refresh_slack_jwt";
export const BASE_API_PATH = "/api";
export const NODE_ENV = process.env.NODE_ENV || "development";
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
export const HOST_NAME = process.env.HOST_NAME || "";

export const AFTER_LOGIN_URL = process.env.DOMAIN_URL || "";

export const getCookiesOptions = (cookies: CookieOptions = {}) => {
  const updatedCookies = { ...cookies };
  updatedCookies.expires =
    updatedCookies.expires ||
    new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000);
  updatedCookies.httpOnly = updatedCookies.httpOnly || true;
  updatedCookies.sameSite = updatedCookies.sameSite || "lax";
  updatedCookies.path = updatedCookies.path || "/";

  if (process.env.NODE_ENV === "production") {
    updatedCookies.secure = true;
  }

  return updatedCookies;
};

export const SITE_URLS = {
  LOGIN: "/login",
  SIGN_UP: "/sign-up",
};

export const adjectives = [
  "Autumn",
  "Hidden",
  "Bitter",
  "Misty",
  "Silent",
  "Empty",
  "Dry",
  "Dark",
  "Summer",
  "Icy",
  "Delicate",
  "Quiet",
  "White",
  "Cool",
  "Spring",
  "Winter",
  "Patient",
  "Twilight",
  "Dawn",
  "Crimson",
  "Wispy",
  "Weathered",
  "Blue",
  "Billowing",
  "Broken",
  "Cold",
  "Damp",
  "Falling",
  "Frosty",
  "Green",
  "Long",
  "Late",
  "Lingering",
  "Bold",
  "Little",
  "Morning",
  "Muddy",
  "Old",
  "Red",
  "Rough",
  "Still",
  "Small",
  "Sparkling",
  "Wandering",
  "Withered",
  "Wild",
  "Black",
  "Young",
  "Holy",
  "Solitary",
  "Fragrant",
  "Aged",
  "Snowy",
  "Proud",
  "Floral",
  "Restless",
  "Divine",
  "Polished",
  "Ancient",
  "Purple",
  "Lively",
  "Nameless",
];
export const nouns = [
  "Waterfall",
  "River",
  "Breeze",
  "Moon",
  "Rain",
  "Wind",
  "Sea",
  "Morning",
  "Snow",
  "Lake",
  "Sunset",
  "Pine",
  "Shadow",
  "Leaf",
  "Dawn",
  "Glitter",
  "Forest",
  "Hill",
  "Cloud",
  "Meadow",
  "Sun",
  "Glade",
  "Bird",
  "Brook",
  "Butterfly",
  "Bush",
  "Dew",
  "Dust",
  "Field",
  "Fire",
  "Flower",
  "Firefly",
  "Feather",
  "Grass",
  "Haze",
  "Mountain",
  "Night",
  "Pond",
  "Darkness",
  "Snowflake",
  "Silence",
  "Sound",
  "Sky",
  "Shape",
  "Surf",
  "Thunder",
  "Violet",
  "Water",
  "Wildflower",
  "Wave",
  "Water",
  "Resonance",
  "Sun",
  "Wood",
  "Dream",
  "Cherry",
  "Tree",
  "Fog",
  "Frost",
  "Voice",
  "Paper",
  "Frog",
  "Smoke",
  "Star",
];
