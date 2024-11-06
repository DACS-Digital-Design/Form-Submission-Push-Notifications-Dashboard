import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DACS Form Panel',
    short_name: 'DACS Form',
    description: 'DACS Digital Design contact form viewer',
    start_url: '/',
    display: 'standalone',
    background_color: '#282828',
    theme_color: '#2c7e70',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}