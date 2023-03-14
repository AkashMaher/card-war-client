
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect,FC, useState } from 'react'
// import Head from 'next/head';
// import { opacityAnimation } from '../utils/animations'
// import { io } from "socket.io-client";
import socketService from '../services/socketServices';
import JoinRoom from "../components/joinRoom";
import GameContext, { IWarGameContextProps } from "../interfaces/warGame";
// import Game  from "../components/game";
// import styled from 'styled-components';
// import { IWarGameContextProps } from '../interfaces/GameInterface';
import WarGame from '../components/war';
import { useAccount } from 'wagmi';
import { useQuery } from 'react-query';
import { QUERIES } from '../react-query/constants';
import { getCultNFTs, getTpfNFTs } from '../react-query/queries';
import useIsMounted from '../utils/hooks/useIsMounted';
const server = process.env.NEXT_PUBLIC_SERVER || ''
const Home = () => {
    const isMounted = useIsMounted()
    const router = useRouter()
    const { address, isConnected } = useAccount()
    const [isUserAccess, setUserAccess] = useState(false)
    const [connectedWallet,setWallet] = useState<any>('NA')

  const approvedCollections = ['0x61621722798e4370a0d965a5bd1fdd0f527699b1','0x8c3fb10693b228e8b976ff33ce88f97ce2ea9563']

  const { data:tpfData } = useQuery(
    [QUERIES.getTpfNFTs, connectedWallet, approvedCollections[1]],
    () => getTpfNFTs(connectedWallet, approvedCollections[1] )
  )

  const { data:cultData } = useQuery(
    [QUERIES.getCultNFTs, connectedWallet, approvedCollections[0]],
    () => getCultNFTs(connectedWallet, approvedCollections[0] )
  )
  
  useEffect(()=> {
    if(tpfData?.data?.assets?.length>0 || cultData?.data?.assets?.length>0){
      setUserAccess(true)
    } else {
      setUserAccess(false)
    }
  },[cultData,tpfData])

  useEffect(()=> {
    setWallet(address)
  }, [address])

  const handleClick = (_value:any)=> {
    if(!_value) return;
    router.push(`./${_value}`)
  }

  return (
<>
{isMounted &&
<>
    {/* <HomeVids /> */}
    <div className=' w-full h-screen relative bg-opacity-60 text-2xl'>
      <div className="container mx-auto text-center ">
        
        <div className='pt-48'>
          <button onClick={()=> handleClick(!isConnected?"login":"profile")}>{!isConnected?"Connect Wallet":"My Account"}</button>
        </div>
        {
          isUserAccess && <>
          <div >
            <br></br>
            <p>The Card War Game</p><br></br>
            <button onClick={()=> handleClick('play')}>Play Now</button>
          </div>
          </>
        }
        
       {/* <div className="w-[100%] h-[100%] flex align-center-top justify-center">
          {!isInRoom && <JoinRoom checkRoom={checkRoom} setGameStarted={setGameStarted}/>}
          {isInRoom && <WarGame roomId={roomID} />}
        </div> */}
      </div>
    </div>
    </>
    }
    </>
  );
};

export default Home;
