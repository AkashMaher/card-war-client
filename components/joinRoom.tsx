import React, {FC, useContext, useEffect, useState, KeyboardEvent } from "react";
import styled from "styled-components";
import gameContext from "../interfaces/warGame";
import gameService from "../services/gamServices";
import socketService from "../services/socketServices";
import { toast } from "react-toastify";

const JoinRoomContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2em;
`;

const RoomIdInput = styled.input`
  height: 30px;
  width: 20em;
  font-size: 17px;
  outline: none;
  border: 1px solid #8e44ad;
  border-radius: 3px;
  padding: 0 10px;
`;

const JoinButton = styled.button`
  outline: none;
  background-color: #8e44ad;
  color: #fff;
  font-size: 17px;
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 4px 18px;
  transition: all 230ms ease-in-out;
  margin-top: 1em;
  cursor: pointer;

  &:hover {
    background-color: transparent;
    border: 2px solid #8e44ad;
    color: #8e44ad;
  }
`;

const JoinRoom: FC<{checkRoom:(_value:any)=> void , setGameStarted:(_value:boolean)=> void}> = ({checkRoom, setGameStarted}) =>  {
  const [roomName, setRoomName] = useState("");
  const [isJoining, setJoining] = useState(false);
  const [roomId,setRoomId] = useState<any>()
  const [isJoin,setIsJoin] = useState()
  const { setInRoom, isInRoom } = useContext(gameContext);

  const handleRoomNameChange = (_roomId:any) => {
    const value = _roomId;
    console.log(value)
    setRoomName(value);
  };


  const joinRoom = async (number:any) => {

    const socket = socketService.socket;
    if (!socket) return;

    setJoining(true);

      // const joined = await gameService
      // .joinGameRoom(socket, roomName)
      // .catch((err: any) => {
      //   alert(err);
      // });

      
      const joined = await gameService
      .joinGameRoom(socket, `${number}`)


      .catch((err: any) => {
        toast.error(err)
        return false
      });
      

      await(500)
      //testing
      console.log('checking')
      console.log(joined)
      // console.log(joined)
      if (joined) {
        await checkRoom(number)
        await setInRoom(true)
      };
      if(joined?.users == 2) {
        setGameStarted(true)
      }
      
    console.log('in room : ', number)

    setJoining(false);
    return true
  };

  const handleRoom = async() => {
    let number:any = Math.floor((Math.random() * 89999) + 10000);
    setRoomId(number)
    let checker:any = await joinRoom(number)
    // console.log(checker)
    if(checker == false) {
      number = Math.floor((Math.random() * 89999) + 10000);
    setRoomId(number)
      await joinRoom(number)
    }
    
  }

  const handleBtn = (_value:any) => {
    if(_value == 1) {
      setIsJoin(_value)
    } else if(_value == 2) {
      setIsJoin(_value)
      handleRoom()
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      joinRoom(roomName)
    }
  }

  return (
    <div className="bg-[#0b0116] text-white bg-opacity-60 border-2 border-zinc-900  p-8 box-border border-solid rounded-xl m-5">
    
    {/* <form >
      <div className="w-[100%] gap-5  h-[100%]  flex align-middle justify-center  flex-col">
        <p className="m-0 font-bold ">Welcome to Card War Game</p>
        <p className="text-2xl">Enter Room ID to Join the Game</p>
        <input 
      className="h-10 w-auto text-md bg-transparent outline-2 border-solid border-cyan-900 border-[1px] py-4"
          placeholder="Room ID"
          value={roomName}
          type="text"
          onChange={(e)=> handleRoomNameChange(e.target.value)}
        />
        
      </div>
    </form> */}
    <div className="text-3xl sm:text-xl font-sans flex flex-col items-center w-[520px] h-[350px] sm:w-[310px] sm:h-[300px] gap-6">
      <p className="m-0 font-bold ">Welcome to Card War Game</p>
                {isJoin == 1 && <>
                
                <p className="text-2xl">Enter Room ID to Join the Game</p>
                <input 
                className="h-10 w-auto text-md bg-transparent outline-2 border-solid border-cyan-900 border-[1px] py-4"
                    placeholder="Room ID"
                    value={roomName}
                    type="text"
                    onChange={(e)=> handleRoomNameChange(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                  />
                <button 
                  className="outline-none p-3 rounded-[12px] bg-violet-900 text-[#ffffff] font-md border-transparent border-solid border-2 border-r-4 px-4 py-18 mt-4 cursor-pointer bg-gradient-to-r hover:border-2 hover:text-[#b779d1] align-middle "
                  onClick={()=> joinRoom(roomName)}  disabled={isJoining}>
                            {isJoining ? "Creating..." : "Join Room"}
                </button>
                </>}

                {isJoin == 1 || !isJoin && <button 
                  className="outline-none p-3 rounded-[12px] bg-violet-900 text-[#ffffff] font-md border-transparent border-solid border-2 border-r-4 px-4 py-18 mt-10 cursor-pointer bg-gradient-to-r hover:border-2 hover:text-[#b779d1] align-middle "
                  onClick={()=> handleBtn(1)}  disabled={isJoining}>
                            {isJoining ? "Creating..." : "Join Room"}
                </button>}


                {isJoin == 2 || !isJoin && <button 
                  className="outline-none p-3 rounded-[12px] bg-violet-900 text-[#ffffff] font-md border-transparent border-solid border-2 border-r-4 px-4 py-18 mt-4 cursor-pointer bg-gradient-to-r hover:border-2 hover:text-[#b779d1] align-middle "
                  onClick={()=> handleBtn(2)}  disabled={isJoining}>
                            {isJoining ? "Creating..." : "Create Room"}
                </button> }
                {/* <div ><Image src={drawnOpponent?drawnOpponent:`/images/cards/wait_card.png`} width={'520px'} height={'316px'}/></div> */}
                <p className="m-0 mt-2 text-lg font-sans"></p>
            </div> 
    
    </div>
  );
}


export default JoinRoom