import React, {FC, useContext, useState } from "react";
import styled from "styled-components";
import gameContext from "../interfaces/warGame";
import gameService from "../services/gamServices";
import socketService from "../services/socketServices";


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

const JoinRoom: FC<any> = () =>  {
  const [roomName, setRoomName] = useState("");
  const [isJoining, setJoining] = useState(false);

  const { setInRoom, isInRoom } = useContext(gameContext);

  const handleRoomNameChange = (_roomId:any) => {
    const value = _roomId;
    console.log(value)
    setRoomName(value);
  };

  const joinRoom = async () => {

    const socket = socketService.socket;
    if (!roomName || roomName.trim() === "" || !socket) return;

    setJoining(true);

      const joined = await gameService
      .joinGameRoom(socket, roomName)
      .catch((err: any) => {
        alert(err);
      });



      await(500)
      //testing
      console.log('checking')
      console.log(joined)
      // console.log(joined)
      if (joined) {
        await setInRoom(true)
      };
    console.log('in room : ', isInRoom)

    setJoining(false);
  };
// console.log(isInRoom)
  return (
    <div className="bg-[#0b0116] text-white bg-opacity-60 border-2 border-zinc-900  p-8 box-border border-solid rounded-xl m-5">
    
    <form >
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
        <button 
className="outline-none p-3 rounded-[12px] bg-violet-900 text-[#ffffff] font-md border-transparent border-solid border-2 border-r-4 px-4 py-18 mt-4 cursor-pointer bg-gradient-to-r hover:border-2 hover:text-[#b779d1]"
onClick={()=> joinRoom()} type="submit" disabled={isJoining}>
          {isJoining ? "Joining..." : "Join Room"}
        </button>
      </div>
    </form>
    </div>
  );
}


export default JoinRoom