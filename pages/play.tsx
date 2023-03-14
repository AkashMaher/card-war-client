
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect,FC, useState } from 'react'
import socketService from '../services/socketServices';
import JoinRoom from "../components/joinRoom";
import GameContext, { IWarGameContextProps } from "../interfaces/warGame";
import WarGame from '../components/war';
import Player from '../components/player';
import { useAccount, useConnect, useDisconnect,useSwitchNetwork,useNetwork, chainId } from 'wagmi'
import useIsMounted from '../utils/hooks/useIsMounted'
import { createUser, getCultNFTs, getGame, getOpponent, getTpfNFTs, getUser } from '../react-query/queries'
import { QUERIES } from '../react-query/constants'
import { useMutation, useQuery } from 'react-query'
import { queryClient } from '../react-query/queryClient'


const server = process.env.NEXT_PUBLIC_SERVER || ''
const intialUser:User = {
      _id:'',
    user_name:'User...',
    wallet_address:'',
    image:'/images/default.jpg'
}
export type User = {
  _id:string
  user_name:string,
  wallet_address:string,
  image:string
}

  export type GameRoom = {
       host?:String,
       address:any,  
       room_Id:any,
       winning_address?:String,
       start_time?:any,
       end_time?:any
  }
const Home = () => {

  const initialRoomData = {
       host:'',
       address:'',  
       room_Id:'',
       winning_address:'',
       start_time:'',
       end_time:''
  }

    const isMounted = useIsMounted()
    const router = useRouter()
    const { address, isConnected } = useAccount()
    const [roomID ,setRoomId] = useState('')
    const [isInRoom, setInRoom] = useState(false);
    const [isPlayerTurn, setPlayerTurn] = useState(false);
    const [isGameStarted, setGameStarted] = useState(false);
    const [isAccess,setIsAccess] = useState<boolean>(true);
    const [opponent, setOpponent] = useState<User>(intialUser)
    const [connectedWallet, setWallet] = useState<any>('NA')
    const [userInfo,setUserInfo] = useState<User>(intialUser)
    const [opponentWallet,setOpponentWallet] = useState<any>('NA')
    const [roomData, setRoomData] = useState<GameRoom>(initialRoomData)
    const [UserDataSuccess,setUserDataSuccess] = useState(false)
    const [room, setRoom] = useState<any>()
    const approvedCollections = ['0x61621722798e4370a0d965a5bd1fdd0f527699b1','0x8c3fb10693b228e8b976ff33ce88f97ce2ea9563']

    const { data:tpfData } = useQuery(
      [QUERIES.getTpfNFTs, connectedWallet, approvedCollections[1]],
      () => getTpfNFTs(connectedWallet, approvedCollections[1] )
    )

    const { data:cultData } = useQuery(
      [QUERIES.getCultNFTs, connectedWallet, approvedCollections[0]],
      () => getCultNFTs(connectedWallet, approvedCollections[0] )
    )
  

    const {data:getGameInfo} = useQuery([QUERIES.getGame,roomData?.room_Id],()=>
    getGame(roomData?.room_Id)
  )

  const checkOpponent = async ()=> {
    let addresses = getGameInfo?.data?.data?.addresses
    let opaddress = addresses?.player1 == address?addresses?.player2:addresses?.player1
    if(opaddress == '' || opaddress == undefined || opaddress == null) {
      return await setOpponentWallet(opponentWallet)
    }
    await setOpponentWallet(opaddress)
  }

  
  useEffect(()=> {
    checkOpponent()
  })
  useEffect(()=> {
    if(tpfData?.data?.assets?.length>0 || cultData?.data?.assets?.length>0){
      setIsAccess(true)
    } else {
      setIsAccess(false)
      // setIsAccess(true)
    }
  },[cultData,tpfData, isMounted])

  useEffect(()=> {
    setWallet(address)
  }, [address])

  const { data:UserData } = useQuery(
    [QUERIES.getUser, address],
    () => getUser(address)
  )
  
  useEffect(()=> {
    setRoom(getGameInfo)
  },[getGameInfo])

  useEffect(()=> {
    setUserInfo(UserData?.data?.data)
    setUserDataSuccess(true)
  }, [UserData])

  const { data:OpponentData, refetch:refetchOpponent } = useQuery(
    [QUERIES.getOpponent, opponentWallet],
    () => getOpponent(opponentWallet)
  )
  

  useEffect(()=> {
    setOpponent(OpponentData?.data?.data)
  }, [OpponentData, opponent])


    const checkRoom = (_value:any)=> {
      if(_value) {
        setRoomId(_value)
      }
    }
    const connectSocket = async () => {
    const socket = await socketService
      .connect(server)
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  useEffect(() => {
    connectSocket();
  }, []);

  useEffect(() => {
    if(!address && !isConnected) {
      router.push('/login')
    }
    // if(UserDataSuccess && !userInfo && address) {
    //   router.push('/setting')
    // }
  },[address, isConnected, router])
    const gameContextValue: IWarGameContextProps = {
      isInRoom,
      setInRoom,
      isPlayerTurn,
      setPlayerTurn,
      isGameStarted,
      setGameStarted,
      isAccess,
      setIsAccess,
      opponent,
      setOpponent,
      roomData,
      setRoomData,
      room,
      setRoom,
      opponentWallet,
      setOpponentWallet
    };
  
    // console.log(isInRoom)
  // const handleClick = (_value:any)=> {
  //   if(!_value) return;
  //   router.push(`./${_value}`)
  // }

  // console.log(opponentWallet)
  return (
<>
    {/* <HomeVids /> */}
    {isMounted && 
    <div className='h-screen'>
    <GameContext.Provider value={gameContextValue}>
      {isAccess && userInfo && <div className="container mx-auto text-center pt-12">
        <div ><Player you={userInfo} opponent={opponent}/></div>
       <div className="w-[100%] h-[100%] justify-center flex align-center-top">
        
        
          {!isInRoom && <JoinRoom checkRoom={checkRoom} setGameStarted={setGameStarted} />}
          {isInRoom && <WarGame roomId={roomID} />}
        </div>
      </div>
      }
      {
        isAccess && !userInfo && 
        <div className="container mx-auto text-center pt-12">
          <p>Please Create Profile Before playing</p>
          <button className="outline-none mr-4 mt-4 w-30 h-full bg-[#585858] py-[1%] px-[9.5%] text-white rounded-lg" onClick={()=> router.push('/setting')}>Go to setting</button>
        </div>
      }
      {!isAccess &&
      <div className="container mx-auto text-center pt-12">
      <p>{`User Don't have access to play the game`}</p>
      </div>}
    </GameContext.Provider> 
    </div>
      }
    </>
  );
};

export default Home;