
class Card {
  value: number;
  suit: string;
  constructor(value: number, suit: string) {
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
    this.shuffle();
    this.deal()
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

  drawCard(player: number) {
    if(player == 1) {
        return this.player1.pop();
    } else {
        return this.player2.pop();
    }
    
  }

  war(player: number) {
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

            console.log(`WAR: Player ${player} draws ${point.value} of ${point.suit}`)
        }
        return {
            points:points,
            player: player,
            topCard:topCard
        }
  }
}

class Player {
  name: string;
  deck: Deck;
  constructor(name: string) {
    this.name = name;
    this.deck = new Deck();
  }

  draw(player: number) {

    return this.deck.drawCard(player);
  }

  warPoints(player: number) {
    return this.deck.war(player)
  }
}

function compareCards(card1: { value: number; }, card2: { value: number; }) {
    // console.log(card1,card2)
  if (card1.value > card2.value) {
    return 1;
  } else if (card1.value < card2.value) {
    return 2;
  } else {
    return 0;
  }
}

// function war(player1,player2) {
    
//     }
    
    


function playGame() {
  console.log('Welcome to Card War!');
  const player1 = new Player('Player 1');
  const player2 = new Player('Player 2');
//   const card11 = player2.draw(1);
//   console.log(card11)
// console.log(player1.deck.cards)
// console.log(player1.deck.player1)
//   console.log(player2.deck.player2)
    let pp1 = 0
    let pp2 = 0
    while (player1.deck.player1.length > 0 && player2.deck.player2.length > 0 && pp1 < 52 && pp2 < 52) {
    



    const card1 = player1.draw(1);
    const card2 = player2.draw(2);



    console.log(`${player1.name} draws ${card1}`);
    console.log(`${player2.name} draws ${card2}`);
    
    // const result = compareCards(card1, card2);
    let points = card1.value+card2.value
    if(card1.value>card2.value){
        pp1 += points;
    } else if (card1.value<card2.value){
        pp2 += points;
    } else if (card1.value==card2.value){
        let warpoints =0
        let warresult =0
        let p1 = player1.warPoints(1)
        let p2 = player2.warPoints(2)
        console.log(p1)
        warpoints += (p1.points + p2.points)
        if(p1.topCard>p2.topCard){
            warresult = 1
        } else if(p1.topCard<p2.topCard){
            warresult = 2
        } else if(p1.topCard==p2.topCard) {
            let p11 = player1.warPoints(1)
            let p22 = player2.warPoints(2)
            warpoints += (p11.points + p22.points)
            if(p11.topCard>p22.topCard){
                warresult = 1
            } else if(p11.topCard<p22.topCard){
                warresult = 2
            } 
        }
        if(warresult ==1) {
            pp1 += warpoints+points
        } else if (warresult == 2){
            pp2 += warpoints+points
        }
        console.log("war with result", warresult, warpoints)
    }

    
    // if (result === 1) {
    //   console.log(`${player1.name} wins!`);
    //   player1.deck.player1.unshift(card1, card2);
    // } else if (result === 2) {
    //   console.log(`${player2.name} wins!`);
    //   player2.deck.player2.unshift(card1, card2);
    // } else {
    //   console.log('It\'s a tie!');
    //   player1.deck.player1.unshift(card1);
    //   player2.deck.player2.unshift(card2);
    // }
  }
  if (player1.deck.player1.length === 0 || pp2>=52) {
    console.log(`${player2.name} wins the game!`);
    console.log('reason : ',player1.deck.player1.length === 0?"Out of Cards : "+`Player 1 : ${pp1}, Player 2 : ${pp2}`:`${pp2} points won, player 1 have ${pp1} points` )
  } else {
    console.log(`${player1.name} wins the game!`);
    console.log('reason : ',player1.deck.player2.length === 0?"Out of Cards : "+` Player 2 : ${pp2}, Player 1 : ${pp1}`:`${pp1} points won, player 2 have ${pp2} points` )
  }
  return;
}

playGame();