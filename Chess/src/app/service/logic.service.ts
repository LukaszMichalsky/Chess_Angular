import { Injectable, OnInit } from '@angular/core';
import { Color, IPiece, PieceType } from '../models/pieces';

@Injectable({
  providedIn: 'root'
})
export class LogicService implements OnInit {
  public vertical_index: number[] = [];
  public horizontal_index: String[] = [];
  public chessboard: IPiece[][];
  public playerTurn = Color.White; //true if white player turn / false if black player turn
  public isNewGame: boolean = true;
  public isCheck: boolean = false; //after turn check check

  private _whiteLKingPosition = { row: 7, col: 4 };
  private _blackKingPosition = { row: 0, col: 3 };

  constructor() {
    this.chessboard = [];
    for (let i = 0; i < 8; i++) {
      this.chessboard[i] = [];
      for (let j = 0; j < 8; j++) {
        this.chessboard[i][j] = {
          row: i,
          column: j,
          validCell: false
        };
      }
    }
  }

  ngOnInit() {
    if (this.isNewGame) {
      this.setNewGamePieces();
    }
    this.searchKings();
  }
  //-----------------------FUNCTIONS------------------------
  setNewGamePieces() {
    //pierwsze ustawienie figur
    for (
      let i = 0;
      i < 8;
      i++ //pawns
    ) {
      this.chessboard[1][i] = {
        type: PieceType.Pawn,
        color: Color.Black,
        row: 1,
        column: i,
        validCell: false
      };
      this.chessboard[6][i] = {
        type: PieceType.Pawn,
        color: Color.White,
        row: 6,
        column: i,
        validCell: false
      };
    }
    //ROOKS
    this.chessboard[0][0] = { type: PieceType.Rook, color: Color.Black, row: 0, column: 0, validCell: false };
    this.chessboard[0][7] = { type: PieceType.Rook, color: Color.Black, row: 0, column: 7, validCell: false };
    this.chessboard[7][0] = { type: PieceType.Rook, color: Color.White, row: 7, column: 0, validCell: false };
    this.chessboard[7][7] = { type: PieceType.Rook, color: Color.White, row: 7, column: 7, validCell: false };
    //KNIGHTS
    this.chessboard[0][1] = { type: PieceType.Knight, color: Color.Black, row: 0, column: 1, validCell: false };
    this.chessboard[0][6] = { type: PieceType.Knight, color: Color.Black, row: 0, column: 6, validCell: false };
    this.chessboard[7][1] = { type: PieceType.Knight, color: Color.White, row: 7, column: 1, validCell: false };
    this.chessboard[7][6] = { type: PieceType.Knight, color: Color.White, row: 7, column: 6, validCell: false };
    //BISHOPS
    this.chessboard[0][2] = { type: PieceType.Bishop, color: Color.Black, row: 0, column: 2, validCell: false };
    this.chessboard[0][5] = { type: PieceType.Bishop, color: Color.Black, row: 0, column: 5, validCell: false };
    this.chessboard[7][2] = { type: PieceType.Bishop, color: Color.White, row: 7, column: 2, validCell: false };
    this.chessboard[7][5] = { type: PieceType.Bishop, color: Color.White, row: 7, column: 5, validCell: false };
    //QUEENS
    this.chessboard[0][4] = { type: PieceType.Queen, color: Color.Black, row: 0, column: 4, validCell: false };
    this.chessboard[7][3] = { type: PieceType.Queen, color: Color.White, row: 7, column: 3, validCell: false };
    //KINGS
    this.chessboard[0][3] = { type: PieceType.King, color: Color.Black, row: 0, column: 3, validCell: false };
    this.chessboard[7][4] = { type: PieceType.King, color: Color.White, row: 7, column: 4, validCell: false };
  }

  clearChessboard() {
    this.clearValidMoves();
    for (let row of this.chessboard)
      for (let cell of row) {
        cell.type = undefined;
        cell.color = undefined;
      }
  }

  clearValidMoves(): void {
    for (let row of this.chessboard) for (let cell of row) cell.validCell = false;
  }

  setValidCell(row: number, col: number, color: Color | undefined): boolean {
    let val = this.chessboard[row][col].color;
    if (val == undefined) {
      this.chessboard[row][col].validCell = true; //without piece set validcell
      return false;
    } else if (val != color) {
      this.chessboard[row][col].validCell = true;
      return true;
    }
    return true; //-> if(fnc) break
  }

  setPawnValid(row: number, col: number, color: Color | undefined): boolean {
    let val = this.chessboard[row][col];
    let side1 = this.chessboard[row][col + 1];
    let side2 = this.chessboard[row][col - 1];
    let reverseColor: Color = color === Color.White ? Color.Black : Color.White;
    if (side1.color == reverseColor) {
      side1.validCell = true;
    }
    if (side2.color == reverseColor) {
      side2.validCell = true;
    }
    if (val.type != undefined) {
      // is   any piece forward
      val.validCell = false;
      return false;
    }
    val.validCell = true;
    return true;
  }

  changePlayerTurn(): void {
    if (this.playerTurn == Color.White) this.playerTurn = Color.Black;
    else this.playerTurn = Color.White;
  }

  checkIsCheck(): boolean {
    this.searchKings();
    let kingColumn;
    let kingRow;
    if (this.playerTurn === Color.White) {
      // search which turn is and set kings positions
      kingColumn = this._whiteLKingPosition.col;
      kingRow = this._whiteLKingPosition.row;
    } else {
      kingColumn = this._blackKingPosition.col;
      kingRow = this._blackKingPosition.row;
    }
    //check knight
    let j: number;
    for (let i = -2; i <= 2; i++) {
      if (i == 0) continue;
      if (i % 2 == 0) j = -1;
      else j = -2;
      for (let k = 0; k < 2; k++) {
        if (kingRow + i >= 0 && kingRow + i < 8 && kingColumn + j >= 0 && kingColumn + j < 8) {
          //is in array range
          if (
            this.chessboard[kingRow + i][kingColumn + j].type === PieceType.Knight &&
            this.chessboard[kingRow + i][kingColumn + j].color !== this.playerTurn
          )
            return true;
        }
        j = j * -1;
      }
    }
    //check rook
    for (let i = kingRow - 1; i >= 0; i--) {
      //from piece to up
      if (this.chessboard[kingRow + i][kingColumn].type !== undefined) {
        if (
          (this.chessboard[kingRow + i][kingColumn].type === PieceType.Rook ||
            this.chessboard[kingRow + i][kingColumn].type === PieceType.Queen) &&
          this.chessboard[kingRow + i][kingColumn].color !== this.playerTurn
        ) {
          return true;
        } else {
          break;
        }
      }
      // }
      // for(let i=kingRow+1;i<8;i++){//from piece to down
      //   if((this.chessboard[kingRow+i][kingColumn].type === PieceType.Rook || this.chessboard[kingRow+i][kingColumn].type === PieceType.Queen) && this.chessboard[kingRow+i][kingColumn].color !== this.playerTurn)
      //   return true;
      // }
      // for(let i=kingColumn-1;i>=0;i--){//from piece to left
      //   if((this.chessboard[kingRow][kingColumn+i].type === PieceType.Rook ||this.chessboard[kingRow][kingColumn+i].type === PieceType.Queen )&& this.chessboard[kingRow][kingColumn+i].color !== this.playerTurn)
      //   return true;
      // }
      // for(let i=kingColumn+1;i<8;i++){//from piece to to right
      //   if(this.chessboard[kingRow][kingColumn+i].type === PieceType.Rook && this.chessboard[kingRow][kingColumn+i].color !== this.playerTurn)
      //   return true;
    }

    return false;
  }

  searchKings(): void {
    //find starting positions
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (this.chessboard[i][j].type === PieceType.King) {
          this.chessboard[i][j].color === Color.White
            ? ((this._whiteLKingPosition.row = i), (this._whiteLKingPosition.col = j))
            : ((this._blackKingPosition.row = i), (this._blackKingPosition.col = j));
        }
      }
    }
  }
  // ==============================Pieces moveset functions==========================
  PawnMovesSet(tab: IPiece): void {
    let direction: number = tab.color == Color.White ? -1 : 1; //1 for black -1 for white
    this.setPawnValid(tab.row + direction, tab.column, tab.color);
    if (tab.row == 1 && tab.color == Color.Black && this.chessboard[3][tab.column].type == undefined) {
      //first move
      this.chessboard[3][tab.column].validCell = true;
    }
    if (tab.row == 6 && tab.color == Color.White && this.chessboard[4][tab.column].type == undefined) {
      //first move
      this.chessboard[4][tab.column].validCell = true;
    }
  }

  RookMoveSet(tab: IPiece): void {
    for (let i = tab.row - 1; i >= 0; i--) {
      //from piece to up
      if (this.setValidCell(i, tab.column, tab.color)) break;
    }
    for (let i = tab.row + 1; i < 8; i++) {
      //from piece to down
      if (this.setValidCell(i, tab.column, tab.color)) break;
    }
    for (let i = tab.column - 1; i >= 0; i--) {
      //from piece to left
      if (this.setValidCell(tab.row, i, tab.color)) break;
    }
    for (let i = tab.column + 1; i < 8; i++) {
      //from piece to to right
      if (this.setValidCell(tab.row, i, tab.color)) break;
    }
  }

  KnightMoveSet(tab: IPiece): void {
    let j: number;
    for (let i = -2; i <= 2; i++) {
      if (i == 0) continue;
      if (i % 2 == 0) j = -1;
      else j = -2;
      for (let k = 0; k < 2; k++) {
        if (tab.row + i >= 0 && tab.row + i < 8 && tab.column + j >= 0 && tab.column + j < 8) {
          //is in array range
          this.setValidCell(tab.row + i, tab.column + j, tab.color);
        }
        j = j * -1;
      }
    }
  }

  BishopMoveSet(tab: IPiece): void {
    for (
      let i = 1;
      i < 8;
      i++ //diagonal up left
    ) {
      if (tab.row - i < 0 || tab.column - i < 0 || this.setValidCell(tab.row - i, tab.column - i, tab.color)) break;
    }
    for (
      let i = 1;
      i < 8;
      i++ //diagonal up right
    ) {
      if (tab.row - i < 0 || tab.column + i > 7 || this.setValidCell(tab.row - i, tab.column + i, tab.color)) break;
    }
    for (
      let i = 1;
      i < 8;
      i++ //diagonal down right
    ) {
      if (tab.row + i > 7 || tab.column + i > 7 || this.setValidCell(tab.row + i, tab.column + i, tab.color)) break;
    }
    for (
      let i = 1;
      i < 8;
      i++ //diagonal down left
    ) {
      if (tab.row + i > 7 || tab.column - i < 0 || this.setValidCell(tab.row + i, tab.column - i, tab.color)) break;
    }
  }

  KingMoveSet(tab: IPiece): void {
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (tab.row + i >= 0 && tab.row + i <= 7 && tab.column + j >= 0 && tab.column + j <= 7) {
          //is in array range
          this.setValidCell(tab.row + i, tab.column + j, tab.color);
        }
      }
    }
  }

  QueenMoveSet(tab: IPiece): void {
    this.RookMoveSet(tab);
    this.BishopMoveSet(tab);
  }
}
