import React from "react";

export interface IWarGameContextProps {
  isInRoom: boolean;
  setInRoom: (inRoom: boolean) => void;
  isPlayerTurn: boolean;
  setPlayerTurn: (turn: boolean) => void;
  isGameStarted: boolean;
  setGameStarted: (started: boolean) => void;
}



const defaultGameState: IWarGameContextProps = {
    isInRoom: false,
    setInRoom: () => {},
    isPlayerTurn: false,
    setPlayerTurn: () => {},
    isGameStarted: false,
    setGameStarted: () => {},
};



export default React.createContext(defaultGameState);