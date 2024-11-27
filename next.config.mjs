/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  cacheStartUrl: true,
  dynamicStartUrl: true,
  dynamicStartUrlRedirect: '/api/auth/signin',
  reloadOnOnline: true,
});

export default withPWA({
  async headers() {
    return [
      {
        source: '/api/submit-form',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'POST'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type'
          }
        ]
      }
    ]
  }
});