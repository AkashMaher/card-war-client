import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { AiOutlineDisconnect, AiOutlineSetting } from 'react-icons/ai'
import { CgProfile } from 'react-icons/cg'
import { RxDashboard } from 'react-icons/rx'
import {IoWalletOutline} from 'react-icons/io5'
import { useAccount, useDisconnect } from 'wagmi'
import { fromLeftAnimation, fromRightAnimation } from '../utils/animations'
import { CONTAINER_PADDING } from '../utils/constants'
import useIsMounted from '../utils/hooks/useIsMounted'
import useWindowDimensions from '../utils/hooks/useWindowDimensions'

const ConnectButton: FC = () => {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const isMounted = useIsMounted()
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    if (!isConnected) router.push('/login')
    if (isConnected) setIsOpen((prev) => !prev)
    // isMounted && !isConnected && router.push('/connect-wallet')
  }

  const handleBtn = (_value:any) => {
    if(!_value) return;
    if(_value == "disconnect") {
      setIsOpen(false)
      disconnect()
    } else if (_value == "profile") {
      setIsOpen(false)
      router.push('/profile')
    } else if ( _value == "play") {
      setIsOpen(false)
      router.push('/play')
    } else if ( _value == "setting") {
      setIsOpen(false)
      router.push('/setting')
    }
  }

  return (
    <div className="relative flex items-center gap-2">
      <motion.button
        className="btn-primary flex cut-corners w-[120px] md:w-[158px] lg:w-[173px] h-[29px] md:h-[33px] lg:h-[39px] 
      text-xs md:text-sm lg:text-base disabled:bg-gray-500 gap-5"
        onClick={handleClick}
        variants={fromRightAnimation}
        initial="initial"
        animate="final"
        transition={{
          ease: 'easeIn',
          duration: 0.2,
          delay: 1.4,
        }}
      >
        <div>
        {!isMounted
          ? null
          : !isConnected
          ? ''
          : <IoWalletOutline fontSize={25} />}
        </div>
        <div className='text-[.9rem] mt-1'>
        {!isMounted
          ? null
          : !isConnected
          ? 'Connect Wallet'
          : `${address?.substring(0, 4)}...${address?.substring(
              address.length - 4
            )}`}
          </div>
      </motion.button>
      {isOpen && (
        <div
          className="absolute z-50 right-0 left-0 -bottom-[6.3rem] bg-gradient-to-b from-custom-yellow to-custom-orange
         font-nunito pl-1 pt-2 rounded"
        >
          
          <p
            onClick={()=>handleBtn('profile')}
            className="flex items-center gap-3  -bottom-[2rem] cursor-pointer hover:scale-105 transition-transform hover:text-green-500"
          >
            <CgProfile fontSize={20} />
            <span>Profile</span>
          </p>
          <p
            onClick={()=> handleBtn('play')}
            className="flex items-center gap-3  -bottom-[2rem] cursor-pointer hover:scale-105 transition-transform hover:text-blue-500"
          >
            <RxDashboard fontSize={20} />
            <span>Play</span>
          </p>
          <p
            onClick={()=> handleBtn('setting')}
            className="flex items-center gap-3  -bottom-[2rem] cursor-pointer hover:scale-105 transition-transform hover:text-yellow-500"
          >
            <AiOutlineSetting fontSize={20} />
            <span>Setting</span>
          </p>
          <p
            onClick={()=> handleBtn('disconnect')}
            className="flex items-center gap-3  cursor-pointer hover:scale-105 transition-transform hover:text-red-500"
          >
            <AiOutlineDisconnect fontSize={20} />
            <span>Disconnect</span>
          </p>
        </div>
      )}
    </div>
  )
}

const Logo: FC = () => {
  const router = useRouter()
  const { width } = useWindowDimensions()
  const [clientWidth, setClientWidth] = useState(0)

  useEffect(() => {
    setClientWidth(width)
  }, [width])

  return (
    <motion.div
      variants={fromLeftAnimation}
      initial="initial"
      animate="final"
      transition={{
        ease: 'easeInOut',
        duration: 0.6,
        delay: 0.4,
      }}
    >
      <Image
        src="/images/king-card-logo.png"
        alt="car_logo"
        width={clientWidth > 768 ? '80px' : '80px'}
        height={clientWidth > 768 ? '80px' : '80px'}
        className="cursor-pointer"
        onClick={() => router.push('/')}
      />
    </motion.div>
  )
}

const Header: FC = () => {
  return (
    <header className="relative">
      <div
        className={`${CONTAINER_PADDING} bg-transparent absolute left-0 right-0 lg:left-10 lg:right-10`}
      >
        <div className="grid grid-cols-12 gap-1">
          <div className="col-span-3 md:col-span-6">
            <Logo />
          </div>
          <div className="col-span-9 md:col-span-6 flex justify-end items-center gap-2 md:gap-3 lg:gap-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
