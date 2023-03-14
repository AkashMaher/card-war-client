import { useRouter } from 'next/router'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { AvatarType } from '../interfaces/nftInterface'
import useIsMounted from '../utils/hooks/useIsMounted'
// import useWindowDimensions from '../utils/hooks/useWindowDimensions'

// BaseURL of API
const BaseURL = process.env.NEXT_PUBLIC_API_URL || ''

const NFTView: FC<{nft:any}> = ({
    nft
}) => {
  const router = useRouter()
  const [isSelected, setIsSelected] = useState(false)
  const [auctionAmount, setAuctionAmount] = useState()
  const [shadow, setShadow] = useState('')
  const [cardProperties, setCardProperties] = useState({
    dimensions: 'w-[250px] h-[330px]',
  })


  const { address } = useAccount()
  const isMounted = useIsMounted()


  // shadow on select card
  useEffect(() => {
    if (isSelected) setShadow('avatar-shadow')
    else setShadow('')
  }, [isSelected])

  const img = nft?.image_url?nft?.image_url
    : '/images/others/avatar_bg.png'


  let bottomStyle = 'avatar-btn-right'
  if (isMounted) {
    bottomStyle = 'rounded-l-lg'
  }

  return (
    <div>
      <div
        className={`relative cursor-pointer
    
    `}
      >
        <div
          className={`relative w-[140px] h-[160px] sm:w-[180px] sm:h-[200px]`}
        >
          <div
            className="rounded-lg bg-cover
           absolute top-1 bottom-1 left-1 right-1"
            style={{
              backgroundImage: `url(${img})`,
            }}
          ></div>
        </div>
        <div className="absolute p-0 z-30 bottom-3 left-3 right-3 ">
            <div className="opacity-70  bg-dark_heavy p-2 flex  justify-between h-20">
              <div
                className={`pt-[5.2rem]  text-custom_yellow text-base lg:text-lg font-josefin font-semibold
                }`}
              >
                {'Token Id: '}{nft?.name?nft?.token_id: ''}
              </div>
            </div>

            </div>
        </div>
        
      </div>
  )
}

export default NFTView
