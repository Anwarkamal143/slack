import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, HOST_NAME } from "@/constants";
// import { type Google } from "arctic";
const arcticImport = async () => await eval('import("arctic")');
export const googleAuth = async () => {
  const { Google: G, Google } = await arcticImport();
  return new G(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    `${HOST_NAME}/api/google/callback`
  ) as typeof Google;
};

export const getCodeVerifierandState = async () => {
  const { generateCodeVerifier, generateState } = await arcticImport();

  return { generateCodeVerifier, generateState };
};

export const getArcticeMethods = async () => {
  const { generateCodeVerifier, generateState, decodeIdToken, OAuth2Tokens } =
    await arcticImport();

  return { generateCodeVerifier, generateState, decodeIdToken, OAuth2Tokens };
};
