import React from "react";

export interface IWarGameContextProps {
  isInRoom: boolean;
  setInRoom: (inRoom: boolean) => void;
  isPlayerTurn: boolean;
  setPlayerTurn: (turn: boolean) => void;
  isGameStarted: boolean;
  setGameStarted: (started: boolean) => void;
  isAccess:boolean;
  setIsAccess:(access:boolean) => void;
  opponent:any;
  setOpponent:(_value:any) => void;
  roomData:any
  setRoomData:(_value:any) => void;
  room:any;
  setRoom:(_value:any) => void;
  opponentWallet:any
  setOpponentWallet:(_value:any) => void;
}



const defaultGameState: IWarGameContextProps = {
    isInRoom: false,
    setInRoom: () => {},
    isPlayerTurn: false,
    setPlayerTurn: () => {},
    isGameStarted: false,
    setGameStarted: () => {},
    isAccess:false,
    setIsAccess:() => {},
    opponent:[], 
    setOpponent:() => {},
    roomData:{},
    setRoomData:() => {},
    room:{},
    setRoom:()=> {},
    opponentWallet:'',
    setOpponentWallet:()=> {}
};



export default React.createContext(defaultGameState);