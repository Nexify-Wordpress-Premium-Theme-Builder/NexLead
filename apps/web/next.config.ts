import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@nexlead/types", "@nexlead/utils"],
};

export default nextConfig;
