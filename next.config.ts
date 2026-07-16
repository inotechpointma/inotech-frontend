import type { NextConfig } from "next";

const wpHost = (() => {
  try {
    return new URL(process.env.WORDPRESS_API_URL ?? "https://pcportable.ma/wp-json").hostname;
  } catch {
    return "pcportable.ma";
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: wpHost },
      { protocol: "https", hostname: "secure.gravatar.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["clsx", "tailwind-merge"],
  },
};

export default nextConfig;
