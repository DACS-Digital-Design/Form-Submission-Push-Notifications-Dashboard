import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Form Panel',
    short_name: 'Forms',
    description: 'Contact form Viewer',
    start_url: '/',
    display: 'standalone',
    background_color: '#282828',
    theme_color: '#2c7e70',
    icons: [
      {
        src: '/graphic.png',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}