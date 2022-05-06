import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';

import { IPiece,Color,PieceType } from '../models/pieces';
import { LogicService } from '../service/logic.service';

@Component({
  selector: 'game-component',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit,OnDestroy {
  vertical_index: number[] = [];
  horizontal_index: String[] =[];
  validCell: boolean=false
  chessboard: IPiece[][];
  previousClick: IPiece={
    row: -1,
    column: -1,
    validCell: false
  };

  constructor(private logicService: LogicService)
  {
    if(this.logicService.isNewGame)
      this.logicService.setNewGamePieces();
    this.chessboard = logicService.chessboard;
  }

  ngOnInit(): void {
    for(let i=1;i<9;i++)
    {
      this.horizontal_index[i-1]=String.fromCharCode(i+64);
      this.vertical_index[i-1]=i;
      console.log(this.horizontal_index)
    }
    this.vertical_index.reverse();
    //stworzenie i zainicjalizowanie 2 tablic dla indeksow bo latwiej niz wpisywac recznie tablice dla ngfor
    //obie sa w kolejnosci roznacej ale vert index wyswietlic odwrotnie
    //odwrocenie bo na odwrot trzeba wyswietlic dolny lewy a1 dla bialych na dole
  }

  ngOnDestroy(): void {
    this.logicService.isNewGame = true;
    this.logicService.clearChessboard();
  }

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
        console.log("height", tab.column - this.previousClick.column);
        console.log("width", tab.row - this.previousClick.row);

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
}
