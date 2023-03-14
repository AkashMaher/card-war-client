/* eslint-disable jsx-a11y/alt-text */
import { motion } from 'framer-motion'
import { ethers } from 'ethers'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect,useSwitchNetwork,useNetwork, chainId } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { add } from 'date-fns'
import { opacityAnimation } from '../utils/animations'
import Head from 'next/head';
import { QUERIES } from '../react-query/constants'
import {  getUser, createUser, getTpfNFTs, getCultNFTs} from '../react-query/queries'
import { useMutation, useQuery } from 'react-query'
import useIsMounted from '../utils/hooks/useIsMounted'
import { handleAnimationDelay } from '../utils'
import useWindowDimensions from '../utils/hooks/useWindowDimensions'
import NFTView from '../components/NftView'
import Image from "next/image";
import { queryClient } from '../react-query/queryClient'
const AccountPage: NextPage = () => {

const intialUser = {
    name:'Akash',
    user_id:'0',
    image:'https://i.seadn.io/gae/A75MNKwJ5tw7R6t0-2DMcdDqr0ekHIfbDSrGFUgKNg_uwTuzbkin3jCKjph87jgQYq1wkmXd7gZazIrbrTIZ2DEl3upvLe-Bok0u?w=500&auto=format'
}

const defaultImage = '/images/default.jpg'
const isMounted = useIsMounted()
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [userInfo,setUserInfo] = useState<any>(intialUser)
  const [Loading,setLoading] = useState(true)
  const { chain } = useNetwork()
const { width } = useWindowDimensions()
  const { switchNetwork } = useSwitchNetwork()
  const [culdAssets,setculdAssets] = useState<any[]>([])
  const [TPFAssets,setTPFAssets] = useState<any[]>([])
  const [pfp, setPfp] = useState<any>()
  const [editable,setEditable] = useState(false)
  const [hide,setHidden] = useState('hidden')
const approvedCollections = ['0x61621722798e4370a0d965a5bd1fdd0f527699b1','0x8c3fb10693b228e8b976ff33ce88f97ce2ea9563']

const { data:tpfData } = useQuery(
    [QUERIES.getTpfNFTs, address, approvedCollections[1]],
    () => getTpfNFTs(address, approvedCollections[1] )
  )

  const { data:cultData } = useQuery(
    [QUERIES.getCultNFTs, address, approvedCollections[0]],
    () => getCultNFTs(address, approvedCollections[0] )
  )

  useEffect(()=> {
    setculdAssets(cultData?.data?.assets)
    setTPFAssets(tpfData?.data?.assets)
    if(tpfData?.data.assets?.length>0 && !pfp) {
      setPfp(tpfData?.data?.assets?.[0].image_url)
    } else if(cultData?.data.assets?.length>0 && !pfp) {
      setPfp(cultData?.data?.assets?.[0].image_url)
    }
    
  },[cultData, tpfData, pfp,userInfo])



const { data:UserData } = useQuery(
    [QUERIES.getUser, address],
    () => getUser(address)
    
  )

  useEffect(()=> {
    if(!isConnected && !address) {
      router.push('/login')
    }
  })

  useEffect(()=> {
    setUserInfo(UserData?.data?.data)
  }, [UserData])


  const { mutate:createData, data, isLoading, isSuccess } = useMutation(
    createUser,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERIES.createUser)
      },
    }
  )

  useEffect(()=> {
    if(userInfo?.image =='' || userInfo?.image == null) {
    createData({name:userInfo?.user_name,wallet_address:address,image:pfp})
    }
  },[address, createData, pfp, userInfo])



    useEffect(()=> {
      if (window.ethereum) {
        (window as any).ethereum.on('accountsChanged', function (accounts:any) {
          setUserInfo([]);
          setLoading(true);
        //   checkUser();
          return;
        })
      }
    })

  return (
    <div>
      <Head>
        <title id="title">My Account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <>
    <main className="p-4 pt-6 lg:px-16 min-h-screen">
       {isMounted && 
       <>
       
       <motion.div
              className="mt-8 text-center gap-3"
              variants={opacityAnimation}
              initial="initial"
              whileInView="final"
              viewport={{ once: true }}
              transition={{
                ease: 'easeInOut',
                duration: 1,
                delay: 0.4,
              }}
            >
       <div className='text-center gap-5'>
        {/* <h1 className="text-2xl font-bold text-center bg-[#63f7f5] bg-opacity-10">Account Info</h1> */}
        <br></br>
        <div className="relative justify-center flex gap-20 sm:gap-48">
          <div className="relative w-24 h-24">
            <Image className="rounded-full border border-gray-100 shadow-sm" src={userInfo?.image?userInfo?.image:defaultImage} objectFit="fill" layout="fill"/>
          </div>
        </div>
          <div className='pt-8 text-xl' >
          <ul>
              <li className={`outline-0 inline-block`}>{userInfo?.user_name?userInfo?.user_name:''}</li> 
          </ul>
          </div>
        </div>
       </motion.div>
       <motion.div
              className="mt-8"
              variants={opacityAnimation}
              initial="initial"
              whileInView="final"
              viewport={{ once: true }}
              transition={{
                ease: 'easeInOut',
                duration: 1,
                delay: 0.4,
              }}
            >
              <h2 className='text-3xl  font-semibold text-center '>User NFTs</h2>
            </motion.div>
       <motion.div
              className="mt-8 bg-orange-100 bg-opacity-[10%]"
              variants={opacityAnimation}
              initial="initial"
              whileInView="final"
              viewport={{ once: true }}
              transition={{
                ease: 'easeInOut',
                duration: 1,
                delay: 0.4,
              }}
            >
        <p className='text-2xl pl-12 pt-5'>The Plague Frogs</p>
       <div
              className="py-10 md:px-4 bg-transparent rounded-lg grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 sm:grid-cols-3  
          gap-20 w-full  max-w-full mx-auto px-10"
            >
              {TPFAssets?.length == 0 && <p>No Assets Found</p>}
              {TPFAssets?.length>0 &&
                TPFAssets?.map((nft, index) => (
                  <motion.div
                    className="flex justify-center "
                    key={index}
                    variants={opacityAnimation}
                    initial="initial"
                    whileInView="final"
                    viewport={{ once: true }}
                    transition={{
                      ease: 'easeInOut',
                      duration: 0.6,
                      delay: handleAnimationDelay(index, width),
                    }}
                  >
                    <NFTView nft={nft} />
                  </motion.div>
                ))}
            </div>
       </motion.div>
       <motion.div
              className="mt-8 bg-orange-100 bg-opacity-[10%]"
              variants={opacityAnimation}
              initial="initial"
              whileInView="final"
              viewport={{ once: true }}
              transition={{
                ease: 'easeInOut',
                duration: 1,
                delay: 0.4,
              }}
            >
        <p className='text-2xl pl-12 pt-5'>The Cult DAO</p>
       <div
              className="py-10 md:px-4 bg-transparent rounded-lg grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 sm:grid-cols-3  
          gap-20 w-full  max-w-full mx-auto px-10"
            >
              {culdAssets?.length == 0 && <p>No Assets Found</p>}
              {culdAssets?.length>0 &&
                culdAssets?.map((nft, index) => (
                  <motion.div
                    className="flex justify-center "
                    key={index}
                    variants={opacityAnimation}
                    initial="initial"
                    whileInView="final"
                    viewport={{ once: true }}
                    transition={{
                      ease: 'easeInOut',
                      duration: 0.6,
                      delay: handleAnimationDelay(index, width),
                    }}
                  >
                    <NFTView nft={nft} />
                  </motion.div>
                ))}
            </div>
       </motion.div>
       </>
       }
    </main>
    </>
    </div>
  )
}

export default AccountPage
