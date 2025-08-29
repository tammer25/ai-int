const repo = 'ai-int'; // your GitHub repository name
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  assetPrefix: isProd ? `/${repo}/` : '',
  basePath: isProd ? `/${repo}` : '',
};
export default nextConfig;
