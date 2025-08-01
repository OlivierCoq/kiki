// import logoDark from '@/assets/images/logo-dark.png'
import AppProvidersWrapper from '@/components/wrappers/AppProvidersWrapper'
import type { Metadata } from 'next'
import { Play } from 'next/font/google'
import Image from 'next/image'
import NextTopLoader from 'nextjs-toploader'
import '@/assets/scss/app.scss'
import { DEFAULT_PAGE_TITLE } from '@/context/constants'

import logoDark from '@/assets/images/kiki_logo_dark.png'
import logoLight from '@/assets/images/kiki_logo_light.png'

import { UserProvider } from '@/context/useUserContext'

const play = Play({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

// Context
import { EventsProvider } from '@/context/useEventsContext'
import { CustomersProvider } from '@/context/useCustomersContext'


export const metadata: Metadata = {
  title: {
    template: '%s | Kiki - Premium Catering Software',
    default: DEFAULT_PAGE_TITLE,
  },
  description: 'Kiki is a premium catering software designed to streamline your catering business operations.',
}

const splashScreenStyles = `
#splash-screen {
  position: fixed;
  top: 50%;
  left: 50%;
  background: white;
  display: flex;
  height: 100%;
  width: 100%;
  transform: translate(-50%, -50%);
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 1;
  transition: all 15s linear;
  overflow: hidden;
}

#splash-screen.remove {
  animation: fadeout 0.7s forwards;
  z-index: 0;
}

@keyframes fadeout {
  to {
    opacity: 0;
    visibility: hidden;
  }
}
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style suppressHydrationWarning>{splashScreenStyles}</style>
        <link href="https://db.onlinewebfonts.com/c/9c34b4c3e757c4439ed9af2a89b9709b?family=boxicons" rel="stylesheet"></link>
        <link href='https://cdn.boxicons.com/fonts/basic/boxicons.min.css' rel='stylesheet'></link>
        <link href='https://cdn.boxicons.com/fonts/brands/boxicons-brands.min.css' rel='stylesheet'></link>
      </head>
      <body className={play.className}>
        <div id="splash-screen">
          <Image alt="Logo" width={112} height={24} src={logoDark} style={{ height: '7%', width: 'auto' }} priority />
        </div>
        <NextTopLoader color="#ff6c2f" showSpinner={false} />
        <div id="__next_splash">
          <UserProvider> 
            <AppProvidersWrapper>
              <EventsProvider>
                <CustomersProvider>
                  {children}
                </CustomersProvider>
              </EventsProvider>
            </AppProvidersWrapper>
          </UserProvider>
        </div>
      </body>
    </html>
  )
}
