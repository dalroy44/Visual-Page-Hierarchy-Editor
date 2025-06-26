import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['lucide-react', '@dnd-kit/core', '@dnd-kit/sortable', 'reactflow', 'dagre'],
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
};

export default nextConfig;
