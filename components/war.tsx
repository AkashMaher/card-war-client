/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-key */
import React, { FC, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import gameContext from "../interfaces/warGame";
import gameService from "../services/gamServices";
import socketService from "../services/socketServices";
import useIsMounted from "../utils/hooks/useIsMounted";
import Image from "next/image";
import { toast } from "react-toastify";
import JoinRoom from "./joinRoom";
import { useMutation } from "react-query";
import { winGame } from "../react-query/queries";
import { queryClient } from "../react-query/queryClient";
import { QUERIES } from "../react-query/constants";
import { useAccount } from "wagmi";
class Card {
  value: any;
  suit: any;
  constructor(value: any, suit: any) {
    this.value = value;
    this.suit = suit;
  }

  toString() {
    return `${this.value} of ${this.suit}`;
  }
}


class Deck {
  cards: any[];
  player1: any[];
  player2: any[];
  constructor() {
    this.cards = [];
    this.player1 = [];
    this.player2 = [];
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    for (let suit of suits) {
      for (let value = 2; value <= 14; value++) {
        this.cards.push(new Card(value, suit));
      }
    }
    // this.shuffle();
    // this.deal();
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  deal() {
    let p1 = 0
    let p2 = 0
    for (let i =0; i<this.cards.length;i++){
        if(i%2 != 0) {
            this.player1[p1] = this.cards[i];
            p1++;
        } else {
            this.player2[p2] = this.cards[i];
            p2++;
        }
    }
  }
//   drawCard() {
//     return this.cards.pop();
//   }

  drawCard(player: any) {
    if(player == 1) {
        return this.player1.pop();
    } else {
        return this.player2.pop();
    }
    
  }

  war(player: any) {
    let points = 0;
    let topCard = 0;
    let max1 = this.player1.length>4?4:this.player1.length
    let max2 = this.player2.length>4?4:this.player2.length
    let finalSize = player == 1?max1:max2
        for(let i=0;i<finalSize;i++) {
            let point = this.drawCard(player)
            points += point.value

            if(i ==finalSize-1){
                topCard = point.value;
            }

            // console.log(`WAR: Player ${player} draws ${point.value} of ${point.suit}`)
        }
        return {
            points:points,
            player: player,
            topCard:topCard
        }
  }
}


const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "Zen Tokyo Zoo", cursive;
  position: relative;
`;


export type IPlayMatrix = Array<Array<string | null>>;

export interface IStartGame {
  start: boolean;
  opponent:any
}

export interface IJoinGame {
  joined:boolean,
  users:any[],
  size:number
}

export type IPlayCards = {
    cards: {you:Card[], opponent:Card[]},
    WarCards:{you:Card[], opponent:Card[]},
    points: {you:number, opponent:number},
    drawnCards: {you:Card, opponent:Card},
    suffled: boolean,
    isYourTurn:boolean,
    isWar:boolean
  }

export type DrawCards = {
  you:Card, opponent:Card
}
const WarGame:FC<{roomId:any }> = ({roomId}) => {
   
//   const [Cards, setCards] = useState<any>({})
  const [points,setPoints] = useState<number>(0)
  const { address, isConnected } = useAccount()
  const [data, setData] = useState<IPlayCards>()
  const [isSuffled,setIsSuffled] = useState<boolean>(false)
  const [isChecking,setIsChecking] = useState(false)
  const [yourCard,setYourCard] = useState<Card>()
  const [opponentCard,setOpponentCard] = useState<Card>()
  const [resultMessage,setResult] = useState('')
  const isMounted = useIsMounted()
  const [drawnYour,setdrawnYour] = useState('')
  const [drawnOpponent,setdrawnOpponent] = useState('')
  const [gameOver,setGameOver] = useState(false)
  const [drawnCards,setDrawn] = useState<DrawCards>()
  const [copyText,setCopy] = useState('Copy Room ID')
  const initialCard = {
    value:0,
    suit:''
  }
  const {
    isGameStarted,
    setGameStarted,
    isPlayerTurn,
    setPlayerTurn,
    isInRoom,
    setInRoom,
    room,
    opponentWallet,
    setOpponentWallet
  } = useContext(gameContext);


    const { mutate:WinGame,data:GameWinData, isLoading, isSuccess } = useMutation(
    winGame,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERIES.winGame)
      },
    }
  )


// console.log('Game is live ?',isGameStarted)
  const suffleCards = async () => {
    if(isSuffled) return;
    const deal = new Deck()
    await deal.shuffle();
    await deal.deal();
    let p1 = await deal.player1
    let p2 = await deal.player2
    const suffledCards:any = [p1, p2]
    // console.log(suffledCards)
    
    const data = {
      cards: {you:p1,opponent:p2},
      WarCards:{you:[],opponent:[]},
      points: {you:0, opponent:0},
      drawnCards: {you:initialCard, opponent:initialCard},
      suffled: true,
      isYourTurn:false,
      isWar:false
    }
    const newData = {
      cards: {you:p2,opponent:p1},
      WarCards:{you:[],opponent:[]},
      points: {you:0, opponent:0},
      drawnCards: {you:initialCard, opponent:initialCard},
      suffled: true,
      isYourTurn:true,
      isWar:false
    }
    if(socketService.socket){
      await gameService.updateGame(socketService.socket, newData)
    }
    
    // console.log(data)
    await setGameOver(false)
    await setData(data)
    await setIsSuffled(true)
  }


  const checkGameState = (GameData: IPlayCards) => {

    if(GameData.suffled) setIsSuffled(true);

  };



  const checkCard = () => {
    if(opponentCard) {
      let name = opponentCard.suit.toLowerCase()
      let value = opponentCard.value
      // console.log(value)
      setdrawnOpponent(opponentCard.value>0?`/images/cards/${name}_${value}.png`:`/images/cards/wait_card.png`)
    }
    if(yourCard) {
      let name = yourCard.suit.toLowerCase()
      let value = yourCard.value
      // console.log(value)
      if(value>0) {
        setdrawnYour(`/images/cards/${name}_${value}.png`)
      } else {
        setdrawnYour(`/images/cards/wait_card.png`)
      }
    }
  }

  useEffect(()=> {
    // checkCard()
    if(opponentCard) {
      let name = opponentCard.suit.toLowerCase()
      let value = opponentCard.value

      setdrawnOpponent(opponentCard.value>0?`/images/cards/${name}_${value}.png`:`/images/cards/wait_card.png`)
    }
    if(yourCard) {
      let name = yourCard.suit.toLowerCase()
      let value = yourCard.value

      setdrawnYour(yourCard.value>0?`/images/cards/${name}_${value}.png`:`/images/cards/wait_card.png`)
    }
  },[opponentCard,yourCard])


  const DrawYourCard = async () => {
    const newData = data
  
    if(!newData?.isYourTurn) {
      return console.log('Opponent Turn, wait for your turn'), toast.dark('Opponent Turn, wait for your turn', {
        type:'error',
        hideProgressBar:true,
        autoClose:2000
      })
    } 
    
    const card:any = newData.cards.you.pop()

    console.log(card)

    // if(newData?.drawnCards.opponent.value == 0) {
      setYourCard(card)
      newData.drawnCards.you.value = card?.value
      newData.drawnCards.you.suit = card?.suit

      const myCards:any = {you: card, opponent:drawnCards?.opponent}
      const ForServer:any = {you:drawnCards?.opponent,opponent:card}
      if(newData?.isWar || newData?.drawnCards.opponent.value == newData?.drawnCards.you.value) {
        newData?.WarCards.you.push(card)
      } else {
      newData.isWar = false
      }
      newData.isYourTurn = false

      await setData(newData)
      await setDrawn(myCards)

      if(socketService.socket) {
        const updatedForMe: IPlayCards = {
          cards:{you:newData.cards.you,opponent:newData.cards.opponent},
          WarCards:{you:newData?.WarCards.you,opponent:newData?.WarCards.opponent},
          drawnCards:{you:newData.drawnCards.you,opponent:newData.drawnCards.opponent},
          points:{you:newData.points.you,opponent:newData.points.opponent},
          isWar:newData.isWar,
          isYourTurn:false,
          suffled:true,
        }

        const updatedData: IPlayCards = {
          cards:{you:newData.cards.opponent,opponent:newData.cards.you},
          WarCards:{you:newData?.WarCards.opponent,opponent:newData?.WarCards.you},
          drawnCards:{you:newData.drawnCards.opponent,opponent:newData.drawnCards.you},
          points:{you:newData.points.opponent,opponent:newData.points.you},
          isWar:newData.isWar,
          isYourTurn:true,
          suffled:true,
        }

        return await setData(updatedForMe), await gameService.updateGame(socketService.socket, updatedData), await gameService.drawCard(socketService.socket, ForServer), await handleCheckCards();
      }
    // } 
  }

  const handleWarMsg = () => {
    let newData = data 
    if(!newData) return;
    let num = newData?.WarCards.you.length-1
    if((newData?.WarCards.you.length%4 == 0) && (newData?.WarCards?.opponent.length%4 ==0)) {
        if(newData?.WarCards?.you[num]?.value > newData?.WarCards?.opponent[num]?.value) { 
          setResult("You Won The War")
        } else  if(newData?.WarCards?.you[num]?.value < newData?.WarCards?.opponent[num]?.value) { 
          setResult("Opponent Won The War")
        } 
    
    }
    
  }

  useEffect(()=> {
    handleWarMsg()
  })

  const handleWar = async (newData:IPlayCards) => {
    // console.log('war handle')
    if((newData?.WarCards.you.length%4 == 0) && (newData?.WarCards?.opponent.length%4 ==0)) {
      let num = newData?.WarCards.you.length-1
          if(newData?.WarCards?.you[num].value > newData?.WarCards?.opponent[num].value) {
            newData.isWar = false;
            for(let i = 0; i<=num;i++) {
              let p1:any = newData.WarCards.you.pop()
              let p2:any = newData.WarCards.opponent.pop()
              await newData.cards.you.unshift(p1);
              await newData.cards.you.unshift(p2);
              
            }
            setResult(`You Won the War Round`)
            newData.drawnCards.opponent  = initialCard
            newData.drawnCards.you = initialCard
            const myCards:any = {you: initialCard, opponent:initialCard}
            await setDrawn(myCards)
            if(socketService.socket) {
              
              const updatedForMe: IPlayCards = {
                cards:{you:newData.cards.you,opponent:newData.cards.opponent},
                WarCards:{you:newData?.WarCards.you,opponent:newData?.WarCards.opponent},
                drawnCards:{you:newData.drawnCards.you,opponent:newData.drawnCards.opponent},
                points:{you:newData.points.you,opponent:newData.points.opponent},
                isWar:false,
                isYourTurn:false,
                suffled:true,
              }

              const updatedData: IPlayCards = {
                cards:{you:newData.cards.opponent,opponent:newData.cards.you},
                WarCards:{you:newData?.WarCards.opponent,opponent:newData?.WarCards.you},
                drawnCards:{you:newData.drawnCards.opponent,opponent:newData.drawnCards.you},
                points:{you:newData.points.opponent,opponent:newData.points.you},
                isWar:false,
                isYourTurn:true,
                suffled:true,
              }
              await gameService.drawCard(socketService.socket,myCards)
               await setData(updatedForMe), await gameService.updateGame(socketService.socket, updatedData), setIsChecking(false);
            } 

          } else if(newData?.WarCards?.you[num].value < newData?.WarCards?.opponent[num].value) {
            newData.isWar = false;
            for(let i = 0; i<=num;i++) {
              let p1:any = newData.WarCards.you.pop()
              let p2:any = newData.WarCards.opponent.pop()
              await newData.cards.opponent.unshift(p1);
              await newData.cards.opponent.unshift(p2);
            }
            newData.drawnCards.opponent  = initialCard
            newData.drawnCards.you = initialCard
            setResult(`Opponent Won the War Round`)
            const myCards:any = {you: initialCard, opponent:initialCard}
            await setDrawn(myCards)
            if(socketService.socket) {
              const updatedForMe: IPlayCards = {
                cards:{you:newData.cards.you,opponent:newData.cards.opponent},
                WarCards:{you:newData?.WarCards.you,opponent:newData?.WarCards.opponent},
                drawnCards:{you:newData.drawnCards.you,opponent:newData.drawnCards.opponent},
                points:{you:newData.points.you,opponent:newData.points.opponent},
                isWar:false,
                isYourTurn:false,
                suffled:true,
              }

              const updatedData: IPlayCards = {
                cards:{you:newData.cards.opponent,opponent:newData.cards.you},
                WarCards:{you:newData?.WarCards.opponent,opponent:newData?.WarCards.you},
                drawnCards:{you:newData.drawnCards.opponent,opponent:newData.drawnCards.you},
                points:{you:newData.points.opponent,opponent:newData.points.you},
                isWar:false,
                isYourTurn:true,
                suffled:true,
              }
              await gameService.drawCard(socketService.socket,myCards)
               await setData(updatedForMe), await gameService.updateGame(socketService.socket, updatedData), setIsChecking(false);
            } 
          }

        } else {

          if(socketService.socket) {
            const updatedForMe: IPlayCards = {
              cards:{you:newData.cards.you,opponent:newData.cards.opponent},
              WarCards:{you:newData?.WarCards.you,opponent:newData?.WarCards.opponent},
              drawnCards:{you:newData.drawnCards.you,opponent:newData.drawnCards.opponent},
              points:{you:newData.points.you,opponent:newData.points.opponent},
              isWar:true,
              isYourTurn:false,
              suffled:true,
            }

            const updatedData: IPlayCards = {
              cards:{you:newData.cards.opponent,opponent:newData.cards.you},
              WarCards:{you:newData?.WarCards.opponent,opponent:newData?.WarCards.you},
              drawnCards:{you:newData.drawnCards.opponent,opponent:newData.drawnCards.you},
              points:{you:newData.points.opponent,opponent:newData.points.you},
              isWar:true,
              isYourTurn:true,
              suffled:true,
            }
            const myCards:any = {you: newData.drawnCards.you, opponent:newData.drawnCards.opponent}
            const forServer:any = {you:newData.drawnCards.opponent,opponent:newData.drawnCards.you}
            await setDrawn(myCards)
            await gameService.drawCard(socketService.socket,forServer)
             await setData(updatedForMe), await gameService.updateGame(socketService.socket, updatedData), setIsChecking(false);
          } 
        }
  } 
  const handleCheckCards = async () => {
    setIsChecking(true)
    const newData = data
    if(!newData) return console.log('no data'), setIsChecking(false)
    // console.log('VALUE OF YOU : ', newData.drawnCards.you.value)
    // console.log('VALUE OF OPPONENT : ', newData.drawnCards.opponent.value)
    if(!newData.cards.opponent.length || !newData.cards.you.length) {
      let newMessage = !newData.cards.opponent.length?"Opponent Won The Game":"You Won The Game"
      const newWinData = {
        room_Id:room?.data?.data?.room_Id,
       winning_address:!newData.cards.opponent.length?address:opponentWallet,
      }
      console.log(newWinData)
      
      setGameOver(true)
      setIsSuffled(false)
      if(!GameWinData?.data?.data?.winning_address) {
        WinGame({...newWinData})
      }
      if(socketService.socket) {
         return await gameService.gameWin(socketService.socket,newMessage);
      }
    }
    // console.log(newData?.drawnCards.you)
    setYourCard(newData?.drawnCards.you)
    setOpponentCard(newData?.drawnCards.opponent)
    if(!newData.drawnCards.opponent.value) return console.log('waiting for opponent turn'), setIsChecking(false);

    // const totalPoints = newData?.drawnCards.opponent.value + newData?.drawnCards.you.value
    
    if(newData?.drawnCards.opponent.value > newData?.drawnCards.you.value && !newData.isWar) {
      console.log("Value of opponent card is more")
      setResult('Opponent Won the round')
      await newData.cards.opponent.unshift(newData?.drawnCards.opponent);
      // await newData.cards.opponent.unshift(newData?.drawnCards.you);

      newData.drawnCards.opponent  = initialCard
      newData.drawnCards.you = initialCard

      await setData(newData)
      const myCards:any = {you: initialCard, opponent:initialCard}
      await setDrawn(myCards)
      if(socketService.socket) {
        const updatedForMe: IPlayCards = {
          cards:{you:newData.cards.you,opponent:newData.cards.opponent},
          WarCards:{you:newData?.WarCards.you,opponent:newData?.WarCards.opponent},
          drawnCards:{you:newData.drawnCards.you,opponent:newData.drawnCards.opponent},
          points:{you:newData.points.you,opponent:newData.points.opponent},
          isWar:false,
          isYourTurn:false,
          suffled:true,
        }

        const updatedData: IPlayCards = {
          cards:{you:newData.cards.opponent,opponent:newData.cards.you},
          WarCards:{you:newData?.WarCards.opponent,opponent:newData?.WarCards.you},
          drawnCards:{you:newData.drawnCards.opponent,opponent:newData.drawnCards.you},
          points:{you:newData.points.opponent,opponent:newData.points.you},
          isWar:false,
          isYourTurn:true,
          suffled:true,
        }
        await gameService.drawCard(socketService.socket,myCards)
         await setData(updatedForMe), await gameService.updateGame(socketService.socket, updatedData), setIsChecking(false);
      }
      // newData.points.opponent += totalPoints
      // newData.points.you = newData.points.you == 0?0:newData.points.you-newData?.drawnCards.you.value
    } else if(newData?.drawnCards.opponent.value < newData?.drawnCards.you.value && !newData.isWar) {
      console.log("Value of your card is more")
      setResult('You Won the round')
      await newData.cards.you.unshift(newData?.drawnCards.you);
      // await newData.cards.you.unshift(newData?.drawnCards.opponent);

      newData.drawnCards.opponent  = initialCard
      newData.drawnCards.you = initialCard

      await setData(newData)
      const myCards:any = {you: initialCard, opponent:initialCard}
      await setDrawn(myCards)
      if(socketService.socket) {
        const updatedForMe: IPlayCards = {
          cards:{you:newData.cards.you,opponent:newData.cards.opponent},
          WarCards:{you:newData?.WarCards.you,opponent:newData?.WarCards.opponent},
          drawnCards:{you:newData.drawnCards.you,opponent:newData.drawnCards.opponent},
          points:{you:newData.points.you,opponent:newData.points.opponent},
          isWar:false,
          isYourTurn:false,
          suffled:true,
        }

        const updatedData: IPlayCards = {
          cards:{you:newData.cards.opponent,opponent:newData.cards.you},
          WarCards:{you:newData?.WarCards.opponent,opponent:newData?.WarCards.you},
          drawnCards:{you:newData.drawnCards.opponent,opponent:newData.drawnCards.you},
          points:{you:newData.points.opponent,opponent:newData.points.you},
          isWar:false,
          isYourTurn:true,
          suffled:true,
        }
        await gameService.drawCard(socketService.socket,myCards)
         await setData(updatedForMe), await gameService.updateGame(socketService.socket, updatedData), setIsChecking(false);
      } 
      // newData.points.you += totalPoints
      // newData.points.opponent = newData.points.opponent == 0?0:newData.points.opponent-newData?.drawnCards.opponent.value
    } else if(newData?.drawnCards.opponent.value == newData?.drawnCards.you.value || newData?.isWar) {
        console.log('WAR')
        setResult(`It's War Time`)
        await handleWar(newData)
        
      }

    
  }


  // const handleDrawns = async () => {
  //   if(socketService?.socket) {
  //     await gameService.onDrawCard(socketService.socket, (cards) => {
  //       // console.log(cards)
  //       // if(cards?.you?.value == 0 && cards?.opponent?.value == 0) return;

  //       if(cards?.you?.value == 0 || cards?.you?.value == 0) {
  //         setDrawn(cards)
  //         setYourCard(cards?.you)
  //         setOpponentCard(cards?.opponent)
  //         return
  //       }
  //       setDrawn(cards)
  //       setYourCard(cards?.you)
  //       setOpponentCard(cards?.opponent)
  //     })
  //   }
  // }


  // useEffect(()=> {
  //   handleDrawns()
  // })
  const handleGameUpdate = () => {
    if (socketService.socket)
      gameService.onGameUpdate(socketService.socket, async (newData) => {
        // setMatrix(newMatrix);

         setGameStarted(true);
         setGameOver(false)
         setIsSuffled(true)
         if(newData) {


        let isOk = newData?.drawnCards?.you.value>0 && newData?.drawnCards?.opponent.value>0
        let messages = isOk && newData?.drawnCards?.you.value>newData?.drawnCards?.opponent.value && !newData?.isWar?"You Won The Round":isOk && newData?.drawnCards?.you.value<newData?.drawnCards?.opponent.value && !newData?.isWar?"Opponent Won The Round": isOk && newData?.drawnCards?.you.value==newData?.drawnCards?.opponent.value?"It's War Time":resultMessage
        setResult(messages)
        
        
        let result = newData?.cards.you.length == 0?"You Won The Game":newData?.cards.opponent.length == 0?"Opponent Won The Game":''

        
       
        if(!newData?.cards.opponent.length || !newData?.cards.you.length) {
          if(socketService.socket) {
            setGameOver(true)
            setIsSuffled(false)
            const newWinData = {
            room_Id:room?.data?.data?.room_Id,
            winning_address:newData?.cards.opponent.length == 0?address:opponentWallet,
            }
            console.log(newWinData)
            if(!GameWinData?.data?.data?.winning_address) {
              WinGame({...newWinData})
            }
            return gameService.gameWin(socketService.socket,result);
          }
        }
        await setData(newData)
        let n1 = newData.drawnCards.you.value
        let n2 = newData.drawnCards.opponent.value
        // console.log(n1,n2)

        // if(n1 !== 0 && n2 !== 0) {
        //   await setYourCard(yourCard)
        //   await setOpponentCard(opponentCard)
        // } else {
        if(newData?.drawnCards.opponent.value>0) {
        let your = n1 > 0 || n2 > 0 ?newData.drawnCards.you:yourCard
        let opp = n1 > 0 || n2 > 0 ?newData.drawnCards.opponent:opponentCard
        await setYourCard(your)
        await setOpponentCard(opp)
        }
        // }
        
        // console.log(newData)
        checkGameState(newData);
        setPlayerTurn(true);
        checkCard();
        await checkOppCard();
        await isGameOver();
        // return newData;
      }
      });
      
  };

  const handleGameStart = () => {
    if (socketService.socket)
      gameService.onStartGame(socketService.socket, async (options) => {
        setGameStarted(true);
        console.log('hello world')
        console.log(options);
        setOpponentWallet(options?.opponent?.walletAddress)
        if (options.start) setPlayerTurn(true)
        else setPlayerTurn(false);
        
      });
  };
// console.log(data)
  const handleGameWin = () => {
    if (socketService.socket)
      gameService.onGameWin(socketService.socket, (message) => {
        // console.log("Here", message);
        setPlayerTurn(false);
        setResult(message)
        return
        // alert(message);
      });
  };

  const copyRoomId = async () => {
    setCopy('Copied')
    await navigator.clipboard.writeText(roomId)
    // toast.dark(`Copied`, {
    //     type:'success',
    //     hideProgressBar:true,
    //     autoClose:100
    //   })
    // setCopy('Copy Room ID')
  }

  const isGameOver = () => {
    if(data?.cards.opponent.length == 0 || data?.cards?.you.length == 0) {
      setGameOver(true)
    } 
  }


  useEffect(() => {
    handleGameUpdate();
    handleGameStart();
    handleGameWin();
    // handleCheckCards();
  });


/*War = {your == opp}  = true

draw draw draw {
  war.you.push() 
}
 war = {your == opp } = true {
  draw draw draw {
  war.you.push() 
} else {
  your>opp {
    cards.push(war)
  }
}
 }
*/
// console.log(gameOver)

function refreshPage(){
    window.location.reload();
} 
const checkOppCard= ()=> {
  if(data?.isYourTurn && opponentCard?.value == 0) {
    setOpponentCard(data?.drawnCards?.opponent)
  }
}
useEffect(()=> {
  if(data?.isYourTurn && opponentCard?.value == 0) {
    setOpponentCard(data?.drawnCards?.opponent)
  }
},[data,opponentCard])



  return (
    <>
    
   <div className="w-[100%] h-[450px] sm:w-[520px] sm:h-[600px] ">
   <div className="flex flex-col items-center justify-between gap-2 p-4 bg-[#0b0116] bg-opacity-80  border-2 border-zinc-900  box-border border-solid rounded-xl m-5">
        {/* {isGameStarted && !isSuffled && <button  onClick={()=> suffleCards()}>Suffle Cards</button> } */}
        
        <><h3 className="text-white m-0 font-bold text-xl font-sans">{isGameStarted?"A Game of War!":`ROOM ID : ${roomId}`}</h3>
        
        <h3 className="text-white m-0 font-semibold text-base font-sans">{isGameStarted?(yourCard?.value>0 && opponentCard?.value>0?resultMessage:!isSuffled?'Joined Lobby':(data?.isYourTurn?"Your Turn":'Opponent Turn')):''}</h3>
        </>
        
        
        <div className="flex items-center  gap-16 text-white p-8 pt-8">
            {isSuffled && !gameOver && 
            <>
            <div className="flex flex-col items-center">
                {/* <p className="m-0 mt-2 font-sans">{`${yourCard?.suit? yourCard?.suit:''} ${yourCard?.value?yourCard?.value-1:'Card'}`}</p> */}
                <div ><Image src={drawnYour?drawnYour:`/images/cards/wait_card.png`} width={'190px'} height={'250px'}/></div>
                <p className="m-0 mt-2 text-sm font-sans w-20">{'You'}</p>
            </div>
            <div className="flex flex-col items-center">
                {/* <p className="m-0 mt-2 font-sans">{`${opponentCard?.suit? opponentCard?.suit:''} ${opponentCard?.value?opponentCard?.value-1:'Card'}`}</p> */}
                <div ><Image src={drawnOpponent?drawnOpponent:`/images/cards/wait_card.png`} width={'190px'} height={'250px'}/></div>
                <p className="m-0 mt-2 text-sm font-sans w-20">Opponent</p>
            </div> 
            </>}
            {
              isGameStarted && !isSuffled && !gameOver && 
              <>
              <div className="text-lg font-bold font-sans flex flex-col items-center sm:w-[520px] sm:h-[316px] w-[310px] h-[300px] sm:text-xl gap-5">
                
                <p >Suffle Cards to Start Game</p>
                <p ></p>
                <p ></p>
                <div ><Image src={`/images/game_start_wait.png`} width={'250px'} height={'130px'}/></div>
                <button 
                  className="outline-none text-xl p-3 rounded-[12px] bg-violet-900 text-[#ffffff] font-md border-transparent border-solid border-2 border-r-4 px-4 py-18 mt-4 cursor-pointer bg-gradient-to-r hover:border-2 hover:text-[#b779d1] align-middle "
                  onClick={()=> suffleCards()} >
                            {"Shuffle Cards"}
                </button>
                {/* <div ><Image src={drawnOpponent?drawnOpponent:`/images/cards/wait_card.png`} width={'520px'} height={'316px'}/></div> */}
                <p className="m-0 mt-2 text-lg font-sans"></p>
            </div>  
              </>
            }
            {
              isGameStarted && gameOver && !isSuffled && <>
              <div className="text-3xl font-sans flex flex-col items-center sm:w-[520px] sm:h-[316px] w-[310px] h-[300px] sm:text-xl gap-6">
                
                {/* <p >{resultMessage}</p> */}
                <p className="text-xl">{resultMessage=='You Won The Game'?"Congratulations":'Better Luck Next Time'}</p>
                <p ></p>
                <div ><Image src={`/images/game_win.png`} width={'127px'} height={'116px'}/></div>
                <button 
                  className="outline-none text-xl p-3 rounded-[12px] bg-violet-900 text-[#ffffff] font-md border-transparent border-solid border-2 border-r-4 px-4 py-18 mt-4 cursor-pointer bg-gradient-to-r hover:border-2 hover:text-[#b779d1] align-middle "
                  onClick={()=> refreshPage()} >
                            {"Play Again"}
                </button>
                {/* <div ><Image src={drawnOpponent?drawnOpponent:`/images/cards/wait_card.png`} width={'520px'} height={'316px'}/></div> */}
                <p className="m-0 mt-2 text-lg font-sans"></p>
            </div>  
              </>
            }
            {
              !isGameStarted && <>
              <div className="text-3xl font-sans flex flex-col items-center sm:w-[520px] sm:h-[316px] w-[310px] h-[300px] sm:text-xl gap-6">
                
                <p >Share Room ID</p>
                <p >With</p>
                <p >Your Friend</p>
                <button 
                  className="outline-none text-xl p-3 rounded-[12px] bg-violet-900 text-[#ffffff] font-md border-transparent border-solid border-2 border-r-4 px-4 py-18 mt-4 cursor-pointer bg-gradient-to-r hover:border-2 hover:text-[#b779d1] align-middle "
                  onClick={()=> copyRoomId()} >
                            {copyText}
                </button>
                {/* <div ><Image src={drawnOpponent?drawnOpponent:`/images/cards/wait_card.png`} width={'520px'} height={'316px'}/></div> */}
                <p className="m-0 mt-2 text-lg font-sans"></p>
            </div> 
              </>
            }
        </div>
        
        {/* <p className="text-white m-0 text-2xl font-mono font-bold ">Remaining Cards<span id="remainingCards"> 52</span></p> */}
        {/* <button onClick={()=> DrawYourCard()}>Draw</button> */}
        
           {isGameStarted && !gameOver && isSuffled && <button className="outline-none text-sm sm:text-base p-1 sm:p-3 rounded-[12px] bg-violet-900 text-[#fff] border-transparent border-solid border-0.5 border-r-1 px-2 py-18 cursor-pointer  hover:border-1 hover:text-[#bee2ef] " 
           onClick={()=>  (!isSuffled ?suffleCards(): DrawYourCard())} disabled={!data?.isYourTurn}>
            {(!isSuffled?"Suffle Cards":"Draw Card")}
            </button>
            }
         {isSuffled &&<p className="text-white text-xs md:text-base">Remaining Cards : You = {data?.cards?.you.length} , Opponent = {data?.cards?.opponent.length}</p>}
    </div>
    </div>
    </>
  );
}


export default WarGame




// <GameContainer>
//       <div className="flex bg-gradient-to-r from-[#e32626] to-[#eef560] bg-contain bg-no-repeat bg-center tm:bg-opacity-50 bg-opacity-50 border-2 border-zinc-900 w-[75%] h-96 tm:w-full tm:h-96  p-8 box-border border-solid rounded-xl m-5">
//       {!isGameStarted && isMounted && (
//         <h2>Waiting for Other Player to Join to Start the Game!</h2>
//       )}
//       {
//         isGameStarted && !isSuffled && <>

//         {/* <button className="outline-none p-3 rounded-[12px] bg-violet-900 text-[#ffffff] font-md border-transparent border-solid border-2 border-r-4 px-4 py-18 mt-4 cursor-pointer  hover:border-2 hover:text-[#b779d1]" onClick={()=> suffleCards()}>Suffle Cards</button> */}

//         </>
//       }
//       {(isGameStarted && isSuffled) && (
//       <>
//       {/* {data?.cards?.you?.map(({ suit, value }, index) => {
//               return (
//                 <li key={index}>
//                   <a
//                     href="#"
//                     className="text-[11px] hover:bg-custom_yellow hover:text-black text-[#E5E5E5] block px-4 py-1"
//                     // onClick={() => handleSelect(value)}
//                   >
//                     {suit} : {value}
//                   </a>
//                 </li>
//               )
//             })} */}

//       <br></br>
//       <div>
//         {/* <p>{"Your Card: " + yourCard?.suit? yourCard?.suit:'' + " " + yourCard?.value?yourCard?.value:0}</p>
//         <p>{"Opponent Card: " + opponentCard?.suit? opponentCard?.suit:'' + " " + opponentCard?.value?opponentCard?.value:0}</p> */}

//         <p>{`Your Cards : ${yourCard?.suit?yourCard?.suit:''}  ${yourCard?.value?yourCard?.value:0}`}</p>
//         <p>{`Opponent Cards : ${opponentCard?.suit?opponentCard?.suit:''}  ${opponentCard?.value?opponentCard?.value:0}`}</p>
//       </div>
//       <br>
//       </br>
//       <p>User Cards : {data?.cards?.you.length}</p>
      
//       {data?.WarCards?.you?.map(({ suit, value }, index) => {
//               return (
//                 <li key={index}>
//                   <a
//                     href="#"
//                     className="text-[11px] hover:bg-custom_yellow hover:text-black text-[#E5E5E5] block px-4 py-1"
//                     // onClick={() => handleSelect(value)}
//                   >
//                     {suit} : {value}
//                   </a>
//                 </li>
//               )
//             })}
            
//       </>
      
//       )
      
//       } 
//       {isGameStarted && 
//       <button className="outline-none p-3 rounded-[12px] bg-violet-900 text-[#ffffff] font-md border-transparent border-solid border-2 border-r-4 px-4 py-18 cursor-pointer  hover:border-2 hover:text-[#b779d1] mt-64" onClick={()=> (!isSuffled?suffleCards(): DrawYourCard())}>{!isSuffled?"Suffle Cards":"Draw Card"}</button>
//       }
//       {resultMessage && 
//       <>
//       <p>{resultMessage}</p>
//       </>}
//       </div>
      
//     // </GameContainer>