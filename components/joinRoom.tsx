import React, {
  FC,
  useContext,
  useEffect,
  useState,
  KeyboardEvent,
} from "react";
import gameContext from "../interfaces/warGame";
import gameService from "../services/gamServices";
import socketService from "../services/socketServices";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { useMutation, useQuery } from "react-query";
import { QUERIES } from "../react-query/constants";
import { getGame, getUser, updateGame } from "../react-query/queries";
import { queryClient } from "../react-query/queryClient";
import { GameRoom } from "../pages/play";


const JoinRoom: FC<{
  checkRoom: (_value: any) => void;
  setGameStarted: (_value: boolean) => void;
}> = ({ checkRoom, setGameStarted }) => {
  const { setRoomData, roomData, room, setRoom } = useContext(gameContext);

  const [roomName, setRoomName] = useState("");
  const [isJoining, setJoining] = useState(false);
  const [roomId, setRoomId] = useState<any>();
  const [isJoin, setIsJoin] = useState();
  const { setInRoom, isInRoom } = useContext(gameContext);
  const { address, isConnected } = useAccount();
  const handleRoomNameChange = (_roomId: any) => {
    const value = _roomId;
    // console.log(value)
    setRoomName(value);
    setRoomId(value);
  };

  const { data: getGameInfo, isFetched } = useQuery(
    [QUERIES.getGame, roomId],
    () => getGame(roomId)
  );

  useEffect(() => {
    setRoom(getGameInfo?.data?.data);
  }, [getGameInfo, setRoom]);

  const {
    mutate: GameData,
    data,
    isLoading,
    isSuccess,
  } = useMutation(updateGame, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERIES.updateGame);
    },
  });

  useEffect(() => {
    setRoomData(getGameInfo);
  }, [getGameInfo, setRoomData]);

  useEffect(() => {
    if (isFetched && roomId) {
      GameData(roomData);
    }
  }, [GameData, roomData, isFetched, roomId]);

  // console.log(Date.now()/1000)
  const joinRoom = async (number: any) => {
    const newData = {
      address,
      room_Id: "",
      host: address,
    };

    const socket = socketService.socket;
    if (!socket) return;

    setJoining(true);

    // const joined = await gameService
    // .joinGameRoom(socket, roomName)
    // .catch((err: any) => {
    //   alert(err);
    // });
    if (room?.addresses?.player1 == address)
      return (
        toast.dark("can't play yourself", {
          type: "error",
          hideProgressBar: true,
          autoClose: 500,
        }),
        setJoining(false)
      );

    const joined = await gameService
      .joinGameRoom(socket, `${number}`, { walletAddress: address })

      .catch((err: any) => {
        toast.error(err);
        return false;
      });

    await 500;
    //testing
    // console.log('checking')
    // console.log(joined)

    if (joined) {
      newData["address"] = address;
      newData["room_Id"] = `${number}`;
      // console.log(room)
    }
    if (joined && room?.addresses?.player1 !== address) {
      await setRoomData(newData);
      await GameData(newData);
      await checkRoom(number);
      await setInRoom(true);
    }
    if (joined?.users == 2 && room?.addresses?.player1 !== address) {
      setGameStarted(true);
    }

    console.log("in room : ", number);
    setJoining(false);
    return true;
  };

  const handleRoom = async () => {
    let number: any = Math.floor(Math.random() * 89999 + 10000);
    setRoomId(number);
    let checker: any = await joinRoom(number);
    if (checker == false) {
      number = Math.floor(Math.random() * 89999 + 10000);
      setRoomId(number);
      await joinRoom(number);
    }
  };

  const handleBtn = (_value: any) => {
    if (_value == 1) {
      setIsJoin(_value);
    } else if (_value == 2) {
      setIsJoin(_value);
      handleRoom();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      joinRoom(roomName);
    }
  };

  return (
    <div className="w-[100%] h-[450px] sm:w-[520px] sm:h-[600px] ">
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
      <div className="flex flex-col items-center justify-between gap-2 p-4 bg-[#0b0116] bg-opacity-80  border-2 border-zinc-900  box-border border-solid rounded-xl m-5">
        <p className="m-0 font-bold ">Welcome to Card War Game</p>
        {isJoin == 1 && (
          <>
            <p className="text-2xl">Enter Room ID to Join the Game</p>
            <input
              className="h-10 w-auto text-md bg-transparent outline-2 border-solid border-cyan-900 border-[1px] py-4"
              placeholder="Room ID"
              value={roomName}
              type="text"
              onChange={(e) => handleRoomNameChange(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
            />
            <button
              className="outline-none p-3 rounded-[12px] bg-violet-900 text-[#ffffff] font-md border-transparent border-solid border-2 border-r-4 px-4 py-18 mt-4 cursor-pointer bg-gradient-to-r hover:border-2 hover:text-[#b779d1] align-middle "
              onClick={() => joinRoom(roomName)}
              disabled={isJoining}
            >
              {isJoining ? "Joining..." : "Join Room"}
            </button>
          </>
        )}

        {isJoin == 1 ||
          (!isJoin && (
            <button
              className="outline-none p-3 rounded-[12px] bg-violet-900 text-[#ffffff] font-md border-transparent border-solid border-2 border-r-4 px-4 py-18 mt-10 cursor-pointer bg-gradient-to-r hover:border-2 hover:text-[#b779d1] align-middle "
              onClick={() => handleBtn(1)}
              disabled={isJoining}
            >
              {isJoining ? "Joining..." : "Join Room"}
            </button>
          ))}

        {isJoin == 2 ||
          (!isJoin && (
            <button
              className="outline-none p-3 rounded-[12px] bg-violet-900 text-[#ffffff] font-md border-transparent border-solid border-2 border-r-4 px-4 py-18 mt-4 cursor-pointer bg-gradient-to-r hover:border-2 hover:text-[#b779d1] align-middle "
              onClick={() => handleBtn(2)}
              disabled={isJoining}
            >
              {isJoining ? "Joining..." : "Create Room"}
            </button>
          ))}
        {/* <div ><Image src={drawnOpponent?drawnOpponent:`/images/cards/wait_card.png`} width={'520px'} height={'316px'}/></div> */}
        <p className="m-0 mt-2 text-lg font-sans"></p>
      </div>
    </div>
  );
};

export default JoinRoom;
