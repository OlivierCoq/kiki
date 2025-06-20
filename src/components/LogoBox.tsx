import logoDark from '@/assets/images/kiki_logo_light.png'
import logoLight from '@/assets/images/kiki_logo_dark.png'
import logoSm from '@/assets/images/kiki_logo.png'
import Image from 'next/image'
import Link from 'next/link'

const LogoBox = () => {
  return (
    <div className="logo-box">
      <Link href="/dashboard" className="logo-dark">
        {/* <Image src={logoSm} width={10}    alt="logo sm" /> */}
        <Image src={logoDark}  height={60} width={130}   alt="logo dark" />
      </Link>
      <Link href="/dashboard" className="logo-light">
        {/* <Image src={logoSm} width={10}   alt="logo sm" /> */}
        <Image src={logoLight} height={60} width={130}  alt="logo light" />
      </Link>
    </div>
  )
}

export default LogoBox
