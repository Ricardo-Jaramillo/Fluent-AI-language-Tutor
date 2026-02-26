import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  // Expose server-side Supabase vars at build time so Edge Runtime middleware
  // can use them. In Docker, SUPABASE_URL points to host.docker.internal;
  // in local dev it's empty and middleware falls back to NEXT_PUBLIC_ vars.
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL || "",
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
  },
};

export default withNextIntl(nextConfig);
