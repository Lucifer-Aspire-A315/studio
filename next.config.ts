
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // The 'allowedDevOrigins' key was previously under 'experimental'.
  // The error "Unrecognized key(s) in object: 'allowedDevOrigins' at "experimental""
  // suggests it's no longer expected there. Moving it to top-level.
  allowedDevOrigins: ['9000-firebase-studio-1749891643669.cluster-ancjwrkgr5dvux4qug5rbzyc2y.cloudworkstations.dev'],
  experimental: {
    // Other experimental flags would go here if needed
  },
};

export default nextConfig;
