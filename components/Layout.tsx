import { useRouter } from 'next/router'
import { FC, ReactNode } from 'react'
// import Footer from './Footer'

import Header from './Header'
// import Detector from './NetworkDetector'

interface LayoutProps {
  children: ReactNode
}

const Buffer = () => {
  const router = useRouter()
  // if (router.asPath === '/') {
  //   return null
  // }
  return <div className="bg-transparent w-full h-[100px]"></div>
}


const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex bg-mainHomePage bg-fixed bg-no-repeat justify-center  ">
      <div className=" w-full max-w-[1920px] bg-fixed bg-no-repeat bg-cover">
        {/* <Detector /> */}
        <Header />
        <Buffer />
        {/* <Loading /> */}
        {children}
        {/* <CurrentFooter /> */}
      </div>
    </div>
  )
}

export default Layout
