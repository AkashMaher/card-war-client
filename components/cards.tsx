import { useRouter } from 'next/router'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
// import { AvatarType } from '../interfaces'
import useIsMounted from '../utils/hooks/useIsMounted'
// import useWindowDimensions from '../utils/hooks/useWindowDimensions'

const BaseURL = process.env.NEXT_PUBLIC_API_URL || ''
interface CardsProps  {
  // name: string
  // img: string
  variant?: 'xs' | 'sm' | 'lg'
  // contract_address: string
  // contract_type: string
  // createdAt: any
  // is_in_auction?: boolean
  // is_in_sale?: boolean
  noCta?: boolean
  img_url?: string
  nft_name?: string
  setImageView?: Dispatch<
    SetStateAction<{
      isOpen: boolean
      img: string
    }>
  >
  // meta_data_url: string
  // token_id: any
  // token_owner: string
  // updatedAt: string
  // __v: any
  // _id: string
}

// interface NftdataProps {
//   image: string
//   name: string
//   attributes: any
//   description: string
//   external_uri: string
// }

// const placeholderImg = '/images/collections/placeholder.jpg'
const TimerSection: FC<{
  days: number
  hours: number
  minutes: number
  seconds: number
}> = ({ days, hours, minutes, seconds }) => {
  return (
    <div className="text-white  text-[9px] lg:text-xs pt-1 max-w-full">
      {days > 0 && (
        <>
          <span className="rounded bg-gray-600 p-[2px] md:p-1 font-bold font-lora">
            {days}
          </span>
          d{' '}
        </>
      )}
      <span className="rounded bg-gray-600 p-[2px] md:p-1 font-bold font-lora">
        {hours}
      </span>
      h{' '}
      <span className="rounded bg-gray-600 p-[2px] md:p-1 font-bold font-lora">
        {minutes}
      </span>
      m{' '}
      {days === 0 && (
        <>
          <span className="rounded bg-gray-600 p-[2px] md:p-1 font-bold font-lora">
            {seconds}
          </span>
          s
        </>
      )}
    </div>
  )
}

const Cards: FC<CardsProps> = ({
  variant = 'sm',
  noCta,
  // meta_data_url,
  
  img_url,
  nft_name,
  setImageView,
}) => {
  const router = useRouter()
  const [isSelected, setIsSelected] = useState(false)
  // const [Name, setName] = useState('')
  // const [Img, setImg] = useState('')
  const [inputTime, setAuctionTime] = useState('')
  const [auctionAmount, setAuctionAmount] = useState()
  const [shadow, setShadow] = useState('')
  const [cardProperties, setCardProperties] = useState({
    dimensions: 'w-[250px] h-[330px]',
  })

  let contract_address = ''
  let token_id = ''
  let is_in_auction = true
  let meta_data
  let token_owner
  const [D, setD] = useState(0)
  const [H, setH] = useState(0)
  const [M, setM] = useState(0)
  const [S, setS] = useState(0)

  const { address } = useAccount()
  const isMounted = useIsMounted()

  // const { width } = useWindowDimensions()
  // const [clientWidth, setClientWidth] = useState(0)

  // useEffect(() => {
  //   setClientWidth(width)
  // }, [width])

  // useEffect(() => {
  //   if (meta_data_url) {
  //     fetch(meta_data_url)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setName(data.name)
  //         setImg(data.image)
  //       })
  //       .catch((err) => console.error(err))
  //   }
  // }, [meta_data_url])

  // console.log(nftinfo.name)
  const ifInauction = () => {
    if (is_in_auction && !auctionAmount && !inputTime) {
      let url = `${BaseURL}/nft/get-nft/${contract_address}/${token_id}`
      if (is_in_auction) {
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            if (data?.auction) {
              setAuctionTime(data?.auction?.end_date)
              setAuctionAmount(data?.auction?.min_price)
            }
          })
      }
    }
  }
  useEffect(() => {
    ifInauction()
  })

  useEffect(() => {
    if (isSelected) setShadow('avatar-shadow')
    else setShadow('')
  }, [isSelected])

  useEffect(() => {
    if (variant === 'sm') {
      setCardProperties((prev) => ({
        ...prev,
        dimensions: 'lg:w-[250px] lg:h-[330px]',
      }))
    }
    if (variant === 'lg') {
      setCardProperties((prev) => ({
        ...prev,
        dimensions: 'lg:w-[442px] lg:h-[589px]',
      }))
    }
    if (variant === 'xs') {
      setCardProperties((prev) => ({
        ...prev,
        dimensions: 'lg:w-[213px] lg:h-[274px]',
      }))
    }
  }, [variant])

  const handleClick = () => {
    // if (is_in_auction) {
    //   return
    // }
    router.push(`/assets/${contract_address}/${token_id}`)
  }

  if (is_in_auction === true) {
    setInterval(() => {
      if (Date.parse(inputTime) > Date.now()) {
        const Difference = (Date.parse(inputTime) - Date.now()) / 1000
        // console.log(Difference)
        const day = Math.floor(Difference / (24 * 60 * 60))
        const hour = Math.floor((Difference - day * 24 * 60 * 60) / (60 * 60))
        const minute = Math.floor(
          (Difference - day * 24 * 60 * 60 - hour * 60 * 60) / 60
        )
        const second = Math.floor(
          Difference - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60
        )
        setD(day)
        setH(hour)
        setM(minute)
        setS(second)
      } else {
        //
      }
    }, 1000)
  } else {
    //
  }

  const img = '/images/game.png'

  const handleFullView = () => {
    setIsSelected((prev) => !prev)
    setImageView && setImageView({ isOpen: true, img })
  }

  let bottomStyle = 'avatar-btn-right'
  if (isMounted && !is_in_auction) {
    bottomStyle = 'rounded-l-lg'
  }

  return (
    <div onClick={handleFullView}>
      <div
        className={`${shadow} relative w-min mt-16 hover:avatar-shadow cursor-pointer
    before:absolute before:-right-2 before:-top-2 before:w-[82px] before:h-[88px] before:bg-custom_yellow before:rounded-xl 
    `}
      >
        {/* <div className="absolute -top-16 z-20 grid place-items-center">
          {Img ? (
            <Image
              loader={() => Img}
              src={Img}
              width={variant === 'lg' ? '442px' : '250px'}
              height={
                variant === 'lg' && clientWidth > 768
                  ? '641px'
                  : variant === 'lg' && clientWidth <= 768
                  ? '900px'
                  : '382px'
              }
              alt="avatar"
            />
          ) : img ? (
            <Image
              loader={() => img}
              src={img}
              width={variant === 'lg' ? '442px' : '250px'}
              height={
                variant === 'lg' && clientWidth > 768
                  ? '641px'
                  : variant === 'lg' && clientWidth <= 768
                  ? '900px'
                  : '382px'
              }
              alt="avatar"
            />
          ) : (
            <Image
              src={placeholderImg}
              alt="avatar"
              width={variant === 'lg' ? '442px' : '250px'}
              height={
                variant === 'lg' && clientWidth > 768
                  ? '641px'
                  : variant === 'lg' && clientWidth <= 768
                  ? '900px'
                  : '382px'
              }
            />
          )}
        </div> */}
        <div
          className={`
      avatar-card-clip relative w-[160px] h-[225px] ${cardProperties.dimensions} rounded-tr-lg rounded-b-lg 
      bg-gradient-to-b from-custom_gray_outline via-[#373737] to-[#1C1C1C]`}
        >
          <div
            className="avatar-card-clip rounded-b-lg rounded-tr-lg bg-dark_mild bg-scroll bg-cover
           absolute top-3 bottom-3 left-3 right-3"
            // style={{
            //   backgroundImage: `url(${
            //     meta_data?.image
            //       ? meta_data?.image
            //       : img_url
            //       ? img_url
            //       : '/images/others/avatar_bg.png'
            //   })`,
            // }}
            style={{
              backgroundImage: `url(${img})`,
            }}
          ></div>
        </div>
        {!noCta && (
          <div className="absolute  p-0 z-30 bottom-3 left-3 right-3  lg:h-1/4">
            <div className="opacity-70 bg-dark_heavy p-2 flex  justify-between h-20">
              <div
                className={`text-custom_yellow  text-base lg:text-lg font-josefin truncate ${
                  is_in_auction ? 'w-1/2' : ''
                }`}
              >
                {/* {meta_data?.name ? meta_data?.name : nft_name ? nft_name : ''} */}
              </div>
              <div className={`${is_in_auction ? 'w-1/2' : 'w-0'}`}>
                {is_in_auction && (
                  <TimerSection days={D} hours={H} minutes={M} seconds={S} />
                )}
              </div>
            </div>
            <div className="flex  absolute top-10 -bottom-0 right-0 left-0 ">
              {is_in_auction && (
                <div className="text-center grid place-items-center avatar-btn-left w-full  h-full bg-black text-gray-400 rounded-l-lg">
                  <p className="text-[10px] lg:text-xs font-poppins my-0">
                    {is_in_auction ? 'Price' : ''}
                  </p>
                  <p className="text-[8px] lg:text-sm font-poppins font-medium my-0">
                    {is_in_auction && <>{auctionAmount} Ξ</>}
                  </p>
                </div>
              )}

              <div
                role="button"
                className={`${bottomStyle} cursor-pointer w-full h-full bg-custom_yellow opacity-100
        grid place-items-center text-black font-poppins font-semibold text-[13px] lg:text-base capitalize rounded-r-lg 
        hover:bg-[#e6c518]`}
                onClick={handleClick}
              >
                {isMounted && (!is_in_auction || address === token_owner)
                  ? 'View'
                  : isMounted && is_in_auction
                  ? 'Place Bid'
                  : ''}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cards
