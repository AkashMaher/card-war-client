
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
const server = process.env.NEXT_PUBLIC_SERVER || ''
const Home = () => {
    
      const router = useRouter()

    // const [isUser,setUser] = useState(false)
    // const [Loading,setLoading] = useState(true)
    // const [formData, setFormData] = useState(initialFormState)
    // const [checkIfNewUser,setIfNewUser] = useState(false)
    const [roomID ,setRoomId] = useState('')
    const [isInRoom, setInRoom] = useState(false);
    const [isPlayerTurn, setPlayerTurn] = useState(false);
    const [isGameStarted, setGameStarted] = useState(false);
    // const [isSuffled,setIsSuffled] = useState(false)
    // const [playerPoints,setPlayerpoints] = useState(0)
    // const [cards, setCards] = useState<any>()

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

    const gameContextValue: IWarGameContextProps = {
      isInRoom,
      setInRoom,
      isPlayerTurn,
      setPlayerTurn,
      isGameStarted,
      setGameStarted,
    };
  
    // console.log(isInRoom)
  const handleClick = (_value:any)=> {
    if(!_value) return;
    router.push(`./${_value}`)
  }
  return (
<>
    {/* <HomeVids /> */}
    <div className=' w-full bg-mainHomePage bg-cover h-screen relative bg-opacity-60'>
    <GameContext.Provider value={gameContextValue}>
      <div className="container mx-auto text-center ">
        <div className='pt-2 '>
          
        </div>
        
       <div className="w-[100%] h-[100%] flex align-center-top justify-center">
          {!isInRoom && <JoinRoom checkRoom={checkRoom}/>}
          {/* {isInRoom && <Game />} */}
          {isInRoom && <WarGame roomId={roomID} />}
        </div>
      </div>
    </GameContext.Provider> 
    </div>
    </>
  );
};

export default Home;
