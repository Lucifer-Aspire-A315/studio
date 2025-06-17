
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
  allowedDevOrigins: ['https://6000-firebase-studio-1749891643669.cluster-ancjwrkgr5dvux4qug5rbzyc2y.cloudworkstations.dev'],
  serverActions: {
    bodySizeLimit: '2mb', // Increased body size limit
  },
};

export default nextConfig;
