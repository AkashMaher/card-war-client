
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect,FC, useState } from 'react'

import { useAccount } from 'wagmi';
import { useQuery } from 'react-query';
import { QUERIES } from '../react-query/constants';
import {  getUserNfts } from '../react-query/queries';
import useIsMounted from '../utils/hooks/useIsMounted';
const server = process.env.NEXT_PUBLIC_SERVER || ''
const Home = () => {
    const isMounted = useIsMounted()
    const router = useRouter()
    const { address, isConnected } = useAccount()
    const [isUserAccess, setUserAccess] = useState(false)
    const [connectedWallet,setWallet] = useState<any>('NA')

  const { data: user_nfts } = useQuery(
    [QUERIES.get_user_nfts, connectedWallet],
    () => getUserNfts(connectedWallet)
  );
  
  useEffect(()=> {
    if(user_nfts?.access){
      setUserAccess(true)
    } else {
      setUserAccess(false)
    }
  },[user_nfts])

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
