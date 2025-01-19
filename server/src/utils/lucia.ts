import { adjectives, nouns } from "@/constants";

export const osloPassword = async () => {
  const oslopassword = (await eval('import("oslo/password")')) as Promise<any>;
  return oslopassword;
};

export const generateRandomName = (name: string = "") => {
  if (!!(name + "").trim()) {
    return name;
  }
  var adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  var noun = nouns[Math.floor(Math.random() * nouns.length)];

  return adjective + " " + noun;
};
