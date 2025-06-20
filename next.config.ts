
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
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
  allowedDevOrigins: ['https://6000-firebase-studio-1749891643669.cluster-ancjwrkgr5dvux4qug5rbzyc2y.cloudworkstations.dev'],
  // serverActions: { // Temporarily removed due to "Unrecognized key(s)" error.
  //   bodySizeLimit: '2mb', // Default is 1MB. Revisit if 2MB is essential.
  // },
};

export default nextConfig;
