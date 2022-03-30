import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

import { IPiece,Color,PieceType } from '../models/pieces';
import { LogicService } from '../service/logic.service';

@Component({
  selector: 'game-component',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  vertical_index: number[] = [];
  horizontal_index: String[] =[];
  validCell: boolean=false
  chessboard: IPiece[][];
  previousClick: IPiece={
    row: -1,
    column: -1,
    validCell: false
  };

  constructor(private logicService: LogicService) {
     this.chessboard = logicService.chessboard; 
    // this.chessboard = [];
    // for(let i=0;i<8;i++)
    // {
    //   this.chessboard[i] = [];
    //   for(let j=0;j<8;j++)
    //   {
    //     this.chessboard[i][j]= {
    //       "row":i,
    //       "column":j,
    //       "validCell":false
    //     };
    //   }
    //}

  }

  ngOnInit(): void {

    for(let i=1;i<9;i++)
    {
      this.horizontal_index[i-1]=String.fromCharCode(i+64);
      this.vertical_index[i-1]=i;
    }
    this.vertical_index.reverse();
    //stworzenie i zainicjalizowanie 2 tablic dla indeksow bo latwiej niz wpisywac recznie tablice dla ngfor
    //obie sa w kolejnosci roznacej ale vert index wyswietlic odwrotnie
    //odwrocenie bo na odwrot trzeba wyswietlic dolny lewy a1 dla bialych na dole
    // this.appLogicService.setPieces();
  }

  
  // setPieces()//pierwsze ustawienie figur
  // {
  //   for(let i=0;i<8;i++)//pawns
  //   {
  //     this.chessboard[1][i] = {
  //       "type": PieceType.Pawn,
  //       "color": Color.Black,
  //       "row": 1,
  //       "column": i,
  //       "validCell": false
  //     };
  //     this.chessboard[6][i] = {
  //       "type": PieceType.Pawn,
  //       "color": Color.White,
  //       "row": 6,
  //       "column": i,
  //       "validCell": false
  //     }
  //   }
  //   //ROOKS
  //   this.chessboard[0][0]={"type": PieceType.Rook,"color": Color.Black,"row": 0,"column":0,"validCell": false};
  //   this.chessboard[0][7]={"type": PieceType.Rook,"color": Color.Black,"row": 0,"column":7,"validCell": false};
  //   this.chessboard[7][0]={"type": PieceType.Rook,"color": Color.White,"row": 7,"column":0,"validCell": false};
  //   this.chessboard[7][7]={"type": PieceType.Rook,"color": Color.White,"row": 7,"column":7,"validCell": false};
  //   //KNIGHTS
  //   this.chessboard[0][1]={"type": PieceType.Knight,"color": Color.Black,"row": 0,"column":1,"validCell": false};
  //   this.chessboard[0][6]={"type": PieceType.Knight,"color": Color.Black,"row": 0,"column":6,"validCell": false};
  //   this.chessboard[7][1]={"type": PieceType.Knight,"color": Color.White,"row": 7,"column":1,"validCell": false};
  //   this.chessboard[7][6]={"type": PieceType.Knight,"color": Color.White,"row": 7,"column":6,"validCell": false};
  //   //BISHOPS
  //   this.chessboard[0][2]={"type": PieceType.Bishop,"color": Color.Black,"row": 0,"column":2,"validCell": false};
  //   this.chessboard[0][5]={"type": PieceType.Bishop,"color": Color.Black,"row": 0,"column":5,"validCell": false};
  //   this.chessboard[7][2]={"type": PieceType.Bishop,"color": Color.White,"row": 7,"column":2,"validCell": false};
  //   this.chessboard[7][5]={"type": PieceType.Bishop,"color": Color.White,"row": 7,"column":5,"validCell": false};
  //   //QUEENS
  //   this.chessboard[0][4]={"type": PieceType.Queen,"color": Color.Black,"row": 0,"column":4,"validCell": false};
  //   this.chessboard[7][3]={"type": PieceType.Queen,"color": Color.White,"row": 7,"column":3,"validCell": false};
  //   //KINGS
  //   this.chessboard[0][3]={"type": PieceType.King,"color": Color.Black,"row": 0,"column":3,"validCell": false};
  //   this.chessboard[7][4]={"type": PieceType.King,"color": Color.White,"row": 7,"column":4,"validCell": false};

  // }

  validMoves(tab: IPiece )
  {
    this.logicService.clearValidMoves();//clear whole validmoves when pick other gif !!!add color to comper to change choose movepick to the same color not to kill enemy piece
    switch(tab.type)
    {
      case "Pawn":{
        this.logicService.PawnMovesSet(tab);
      }
      break;
      case "Rook":{
        this.logicService.RookMoveSet(tab);
      }
      break;
      case "Knight":{
        this.logicService.KnightMoveSet(tab);
      }
      break;
      case "Bishop":{
        this.logicService.BishopMoveSet(tab);
      }
      break;
      case "Queen":{
        this.logicService.QueenMoveSet(tab);
      }
      break;
      case "King":{
       this.logicService.KingMoveSet(tab);
      }
      break;
    }
    this.logicService.chessboard[tab.row][tab.column].validCell=false;

  }

  play(tab: IPiece)
  {
    if(tab.color==this.logicService.playerTurn || tab.validCell==true)
    {
      if(tab.validCell==false)//if it first click check validMoves
      {
        this.validMoves(tab);
        this.previousClick=tab;
      }
      else//wykonanie ruchu
      {
        tab.color=this.previousClick.color;
        tab.type=this.previousClick.type;
        this.previousClick.color=undefined;
        this.previousClick.type=undefined;
        if((tab.row == 0 && tab.type == PieceType.Pawn) ||  (tab.row == 7 && tab.type == PieceType.Pawn)) 
          tab.type = PieceType.Queen;
        this.logicService.clearValidMoves();
        this.logicService.changePlayerTurn();  
      }

    }else
    {
      this.logicService.clearValidMoves();//klik gdzies na tablice czysci wszsytkei validCells 
    }
  }

  // clearValidMoves(){
  //   for(let row of this.chessboard)
  //     for(let cell of row)
  //         cell.validCell=false;
  // }
  // setValidCell(row: number,col: number,color: any)
  // {
  //   let val = this.chessboard[row][col].color;
  //   if(val == undefined)
  //   {
  //     this.chessboard[row][col].validCell=true;//without piece set validcell
  //     return false;
  //   }
  //   else if(val != color)
  //   {
  //     this.chessboard[row][col].validCell=true;
  //     return true;
  //   }
  //   return true;//-> if(fnc) braeak
  // }
  // changePlayerTurn()
  // {
  //   if(this.PlayerTurn==Color.White)
  //     this.PlayerTurn=Color.Black;
  //   else
  //     this.PlayerTurn=Color.White;
  // }
}