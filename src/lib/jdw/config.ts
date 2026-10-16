import "server-only";
import { cacheLife } from "next/cache";

export type ApiConfig = {
  baseUrl: string;
  key: string;
};

const ORDER_SITE = "https://order.jdwetherspoon.com";

function readViteEnv(bundle: string, name: string): string | null {
  const match = bundle.match(new RegExp(`${name}:"([^"]+)"`));
  return match ? match[1] : null;
}

// The Wetherspoon web ordering site ships its API settings (including the
// public client key) in its JS bundle. Reading them from there means a key
// rotation on their side doesn't take the site down.
async function discoverConfig(): Promise<ApiConfig> {
  "use cache";
  cacheLife("days");

  const html = await fetch(ORDER_SITE).then((res) => res.text());
  const entry = html.match(/src="(\/assets\/index-[^"]+\.js)"/)?.[1];
  if (!entry) throw new Error("Could not find order site bundle");

  const bundle = await fetch(`${ORDER_SITE}${entry}`).then((res) => res.text());
  const baseUrl = readViteEnv(bundle, "VITE_API_PROXY_BASE_URL");
  const version = readViteEnv(bundle, "VITE_API_PROXY_VERSION");
  const key = readViteEnv(bundle, "VITE_API_PROXY_KEY");
  if (!baseUrl || !version || !key) {
    throw new Error("Could not read API settings from order site bundle");
  }

  return {
    baseUrl: `${baseUrl}/${version}`,
    key,
  };
}

export async function getApiConfig(): Promise<ApiConfig> {
  const key = process.env.JDW_API_KEY;
  if (key) {
    return {
      baseUrl:
        process.env.JDW_API_BASE_URL ?? "https://ca.jdw-apps.net/api/v0.1",
      key,
    };
  }
  return discoverConfig();
}
