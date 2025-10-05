import type { Metadata } from 'next'
import { Auth0Provider } from '@auth0/nextjs-auth0'
import { AccessibilityProvider } from './context/AccessibilityContext'
import GlobalLoader from './components/GlobalLoader'
import './globals.css'

export const metadata: Metadata = {
  title: 'Project Compass - Neurodivergent Navigation Assistant',
  description: 'AI-powered navigation for neurodivergent individuals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">
        <Auth0Provider>
          <AccessibilityProvider>
            <GlobalLoader />
            {children}
          </AccessibilityProvider>
        </Auth0Provider>
      </body>
    </html>
  )
}
