import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, HOST_NAME } from "@/constants";
import { type Google } from "arctic";

export const googleAuth = async () => {
  const { Google: G } = await eval('import("arctic")');
  return new G(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    `${HOST_NAME}/api/google/callback`
  ) as Google;
};

export const getCodeVerifierandState = async () => {
  const { generateCodeVerifier, generateState } = await eval(
    'import("arctic")'
  );

  return { generateCodeVerifier, generateState };
};

export const getArcticeMethods = async () => {
  const { generateCodeVerifier, generateState, decodeIdToken } = await eval(
    'import("arctic")'
  );

  return { generateCodeVerifier, generateState, decodeIdToken };
};
