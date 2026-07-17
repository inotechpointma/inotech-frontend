import type { NextConfig } from "next";

const wpHost = (() => {
  try {
    return new URL(process.env.WORDPRESS_API_URL ?? "https://cms.inotech.ma/wp-json").hostname;
  } catch {
    return "cms.inotech.ma";
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: wpHost },
      { protocol: "https", hostname: "secure.gravatar.com" },
    ],
    formats: ["image/avif", "image/webp"],
    // Local trusted placeholder assets only (see public/fixtures/) — used in USE_FIXTURES preview mode.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizePackageImports: ["clsx", "tailwind-merge"],
  },
};

export default nextConfig;
