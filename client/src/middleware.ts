import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, REFRESH_COOKIE_NAME } from "./config";
import { createToken, verifyJwt } from "./lib/jwtToken";
import { db } from "./lib/drizzle";
import { getUserById } from "./data/user";

// This function can be marked `async` if using `await` inside

const PUBLIC_URLS = ["/login", "/sign-up"];
export async function middleware(request: NextRequest) {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  const refreshToken = (await cookies()).get(REFRESH_COOKIE_NAME)?.value;

  const user = await getServerUser(token, refreshToken);
  const url = new URL(request.url);
  // console.log({ user });
  // console.log({ user, url: url.origin });
  const isAuthenticated = !!user?.user?.id;
  const isPublicURL = PUBLIC_URLS.includes(url.pathname);
  let res = NextResponse.next();
  if (isPublicURL && isAuthenticated) {
    res = NextResponse.redirect(new URL("/", request.url));
  }

  if (!isPublicURL && !isAuthenticated) {
    res = NextResponse.redirect(new URL("/login", request.url));
  }
  return res;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

const getServerUser = async (
  token: string | undefined,
  refreshToken: undefined | string
): Promise<null | {
  user: IServerCookieType;
  data: Record<string, any> | null;
}> => {
  return new Promise(async (res, rej) => {
    const response = await verifyAndCreateAuthToken(token, refreshToken);
    return res(response);
  });
};

async function verifyAndCreateAuthToken(
  token: string | undefined,
  refreshToken: string | undefined
) {
  let response: null | {
    user: IServerCookieType;
    data: Record<string, any> | null;
  } = null;
  if (!token || !refreshToken) {
    return response;
  }
  let tokenData = await verifyJwt(token);
  if (!tokenData) {
    getUserById()
    tokenData = await verifyJwt(refreshToken);
    if (!tokenData) {
      return response;
    }
    const { data } = tokenData;
    const {
      token_attributes,
      refresh_attributes,
      refreshToken: refToken,
      token,
    } = await createToken(data as any);
    response = {
      user: data as any,
      data: {
        token_attributes,
        refresh_attributes,
        refreshToken: refToken,
        token,
      },
    };
    (await cookies()).set(COOKIE_NAME, token, token_attributes);
    (await cookies()).set(REFRESH_COOKIE_NAME, refToken, refresh_attributes);
  } else {
    response = {
      data: null,
      user: tokenData?.data as any,
    };
    console.log({ response });
  }

  return response;
}
