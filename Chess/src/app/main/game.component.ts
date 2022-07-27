import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';

import { Color, PieceInterface, PieceType } from '../models/pieces';
import { LogicService } from '../services/logic.service';

@Component({
  selector: 'game-component',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  gameOverFlag: boolean = false;
  vertical_index: number[] = [];
  horizontal_index: String[] = [];
  validCell: boolean = false;
  chessboard: PieceInterface[][];
  previousClick: PieceInterface = {
    row: -1,
    column: -1,
    validCell: false
  };

  constructor(private logicService: LogicService) {
    if (this.logicService.isNewGame) this.logicService.setNewGamePieces();
    this.chessboard = logicService.chessboard;
  }

  ngOnInit(): void {
    this.logicService.playerTurn = Color.White;
    for (let i = 1; i < 9; i++) {
      this.horizontal_index[i - 1] = String.fromCharCode(i + 64);
      this.vertical_index[i - 1] = i;
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

  validMoves(cell: PieceInterface) {
    this.logicService.clearValidMoves(); //clear whole validmoves when pick other gif !!!add color to comper to change choose movepick to the same color not to kill enemy piece
    switch (cell.type) {
      case 'Pawn':
        {
          this.logicService.PawnMovesSet(cell);
        }
        break;
      case 'Rook':
        {
          this.logicService.RookMoveSet(cell);
        }
        break;
      case 'Knight':
        {
          this.logicService.KnightMoveSet(cell);
        }
        break;
      case 'Bishop':
        {
          this.logicService.BishopMoveSet(cell);
        }
        break;
      case 'Queen':
        {
          this.logicService.QueenMoveSet(cell);
        }
        break;
      case 'King':
        {
          this.logicService.KingMoveSet(cell);
          this.logicService.castling(cell);
        }
        break;
    }
    this.logicService.chessboard[cell.row][cell.column].validCell = false;
  }

  play(cell: PieceInterface) {
    if (cell.color == this.logicService.playerTurn || cell.validCell == true) {
      //czy klikane jest po wlasnej figurze lub tez wykonujemy ruch
      if (cell.validCell == false) {
        //if  first click check validMoves
        this.validMoves(cell);
        this.previousClick = cell;
      } //wykonanie ruchu
      else {
        //cell jest komorkja docelowa
        if (cell.type === PieceType.King) {
          this.gameOverFlag = true;
          alert('Game Over!');
        } else {
          if (this.previousClick.type === PieceType.Rook) this.logicService.rookMoved(cell);
          if (this.previousClick.type === PieceType.King) this.logicService.kingMoved();

          cell.color = this.previousClick.color;
          cell.type = this.previousClick.type;

          this.previousClick.color = undefined;
          this.previousClick.type = undefined;
          //promocja piona
          if ((cell.row == 0 && cell.type == PieceType.Pawn) || (cell.row == 7 && cell.type == PieceType.Pawn))
            cell.type = PieceType.Queen;

          this.logicService.clearValidMoves();
          this.logicService.changePlayerTurn();
          if (this.logicService.checkIsCheck()) {
            alert('Check!');
            if (this.logicService.playerTurn === Color.White) this.logicService.whiteKingCastling.canCastling = false;
            else this.logicService.blackKingCastling.canCastling = false;
          } else {
            if (this.logicService.playerTurn === Color.White) this.logicService.whiteKingCastling.canCastling = true;
            else this.logicService.blackKingCastling.canCastling = true;
          }
          //console.log(this.logicService.whiteKingCastling, this.logicService.blackKingCastling);
        }
      }
    } else {
      this.logicService.clearValidMoves(); //klik gdzies na tablice czysci wszsytkei validCells
    }
  }
}
