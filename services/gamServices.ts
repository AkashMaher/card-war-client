import { Socket } from "socket.io-client";
// import { IPlayMatrix, IStartGame } from "../components/game";
import {IPlayCards, IStartGame, IJoinGame} from '../components/war'
class GameService {
  public async joinGameRoom(socket: Socket, roomId: string): Promise<any> {
    return new Promise((rs, rj) => {
      socket.emit("join_game", { roomId });
      socket.on("room_joined", (e) => rs(e));
      socket.on("room_join_error", ({ error }) => rj(error));
    });
  }

  public async updateGame(socket: Socket, gameCards: IPlayCards) {
    socket.emit("update_game", { GameData: gameCards });
  }

  public async onGameUpdate(
    socket: Socket,
    listiner: (GameData: IPlayCards) => void
  ) {
    socket.on("on_game_update", ({ GameData }) => listiner(GameData));
  }
  


  public async onStartGame(
    socket: Socket,
    listiner: (options: IStartGame) => void
  ) {
    socket.on("start_game", listiner);
  }

  public async onGameWin(socket: Socket, listiner: (message: string) => void) {
    socket.on("on_game_win", ({ message }) => listiner(message));
  }

   public async gameWin(socket: Socket, message: string) {
    socket.emit("game_win", { message });
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new GameService();
