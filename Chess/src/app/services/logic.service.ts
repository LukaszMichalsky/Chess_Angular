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

  checkIsValidCell(row: number, col: number, color: Color | undefined): boolean {
    //return true if cell is empty or is enemy else return false(is ally)
    let colorValue = this.chessboard[row][col].color;
    if (colorValue === undefined || colorValue !== color) {
      //if cell is empty
      return true;
    }
    return false;
  }

  setValidCell(row: number, col: number): void {
    this.chessboard[row][col].validCell = true;
  }

  setPawnValidCells(row: number, col: number, color: Color | undefined): void {
    let pawnCell = this.chessboard[row][col];
    let rightSide = this.checkIsOutOfRange(row, col + 1) ? null : this.chessboard[row][col + 1];
    let leftSide = this.checkIsOutOfRange(row, col - 1) ? null : this.chessboard[row][col - 1];

    let reverseColor: Color = color === Color.White ? Color.Black : Color.White;
    if (rightSide?.color === reverseColor) {
      rightSide.validCell = true;
    }
    if (leftSide?.color === reverseColor) {
      leftSide.validCell = true;
    }
    if (pawnCell.type !== undefined) {
      // is   any piece forward
      pawnCell.validCell = false;
      return;
    }
    pawnCell.validCell = true;
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
    for (let i = 1; i < 8; i++) {
      //down
      if (this.checkIsOutOfRange(kingRow + i, kingColumn)) {
        if (
          this.chessboard[kingRow + i][kingColumn].type === (PieceType.Queen || PieceType.Rook) &&
          this.chessboard[kingRow + i][kingColumn].color !== this.playerTurn
        ) {
          return true;
        }
      }
      //up
      if (this.checkIsOutOfRange(kingRow - i, kingColumn)) {
        if (
          this.chessboard[kingRow - i][kingColumn].type === (PieceType.Queen || PieceType.Rook) &&
          this.chessboard[kingRow - i][kingColumn].color !== this.playerTurn
        ) {
          return true;
        }
      }
      //left
      if (this.checkIsOutOfRange(kingRow, kingColumn - i)) {
        if (
          this.chessboard[kingRow][kingColumn - i].type === (PieceType.Queen || PieceType.Rook) &&
          this.chessboard[kingRow][kingColumn - i].color !== this.playerTurn
        ) {
          return true;
        }
      }
      //right
      if (this.checkIsOutOfRange(kingRow, kingColumn + i)) {
        if (
          this.chessboard[kingRow][kingColumn + i].type === (PieceType.Queen || PieceType.Rook) &&
          this.chessboard[kingRow][kingColumn + i].color !== this.playerTurn
        ) {
          return true;
        }
      }
      //leftUp
      if (this.checkIsOutOfRange(kingRow - i, kingColumn - i)) {
      }
      //leftDown
      if (this.checkIsOutOfRange(kingRow - i, kingColumn + i)) {
      }
      //rightUp
      if (this.checkIsOutOfRange(kingRow - i, kingColumn + i)) {
      }
      //rightDown
      if (this.checkIsOutOfRange(kingRow + i, kingColumn + i)) {
      }
    }

    // for (let i = kingRow - 1; i >= 0; i--) {
    //   //from piece to up
    //   if (this.chessboard[kingRow + i][kingColumn].type !== undefined) {
    //     if (
    //       this.chessboard[kingRow + i][kingColumn].type === (PieceType.Rook || PieceType.Queen) &&
    //       this.chessboard[kingRow + i][kingColumn].color !== this.playerTurn
    //     ) {
    //       return true;
    //     } else {
    //       break;
    //     }
    //   }
    // }
    // for (let i = kingRow + 1; i < 8; i++) {
    //   //from piece to down
    //   if (this.chessboard[kingRow + i][kingColumn].type !== undefined) {
    //     if (
    //       this.chessboard[kingRow + i][kingColumn].type === (PieceType.Rook || PieceType.Queen) &&
    //       this.chessboard[kingRow + i][kingColumn].color !== this.playerTurn
    //     ) {
    //       return true;
    //     } else {
    //       break;
    //     }
    //   }
    // }
    // for (let i = kingColumn - 1; i >= 0; i--) {
    //   //from piece to left
    //   if (this.chessboard[kingRow + i][kingColumn].type !== undefined) {
    //     if (
    //       this.chessboard[kingRow][kingColumn + i].type === (PieceType.Rook || PieceType.Queen) &&
    //       this.chessboard[kingRow][kingColumn + i].color !== this.playerTurn
    //     ) {
    //       return true;
    //     } else {
    //       break;
    //     }
    //   }
    // }
    // for (let i = kingColumn + 1; i < 8; i++) {
    //   //from piece to to right
    //   if (this.chessboard[kingRow + i][kingColumn].type !== undefined) {
    //     if (
    //       this.chessboard[kingRow][kingColumn + i].type === (PieceType.Rook || PieceType.Queen) &&
    //       this.chessboard[kingRow][kingColumn + i].color !== this.playerTurn
    //     ) {
    //       return true;
    //     } else {
    //       break;
    //     }
    //   }
    // }
    // //check bishop
    // for (let i = 1; i < 8; i++) {
    //   //diagonal up left
    //   if (kingRow - i < 0 || kingColumn - i < 0 || this.chessboard[kingRow - i][kingColumn - i].type !== undefined) {
    //     if (
    //       this.chessboard[kingRow - i][kingColumn - i].type === (PieceType.Bishop || PieceType.Queen) &&
    //       this.chessboard[kingRow][kingColumn + i].color !== this.playerTurn
    //     ) {
    //       return true;
    //     } else {
    //       break;
    //     }
    //   }
    // }
    // for (let i = 1; i < 8; i++) {
    //   //diagonal up right
    //   if (kingRow - i < 0 || kingColumn + i < 0 || this.chessboard[kingRow - i][kingColumn + i].type !== undefined) {
    //     if (
    //       this.chessboard[kingRow - i][kingColumn - i].type === (PieceType.Bishop || PieceType.Queen) &&
    //       this.chessboard[kingRow][kingColumn + i].color !== this.playerTurn
    //     ) {
    //       return true;
    //     } else {
    //       break;
    //     }
    //   }
    // }
    // for (let i = 1; i < 8; i++) {
    //   //diagonal down right
    //   if (kingRow + i > 0 || kingColumn + i > 0 || this.chessboard[kingRow + i][kingColumn + i].type !== undefined) {
    //     if (
    //       this.chessboard[kingRow - i][kingColumn - i].type === (PieceType.Bishop || PieceType.Queen) &&
    //       this.chessboard[kingRow][kingColumn + i].color !== this.playerTurn
    //     ) {
    //       return true;
    //     } else {
    //       break;
    //     }
    //   }
    // }
    // for (let i = 1; i < 8; i++) {
    //   //diagonal down left
    //   if (kingRow + i > 7 || kingColumn - i < 0 || this.chessboard[kingRow + i][kingColumn - i].type !== undefined) {
    //     if (
    //       this.chessboard[kingRow - i][kingColumn - i].type === (PieceType.Bishop || PieceType.Queen) &&
    //       this.chessboard[kingRow][kingColumn + i].color !== this.playerTurn
    //     ) {
    //       return true;
    //     } else {
    //       break;
    //     }
    //   }
    // }
    // //check pawn
    // console.log(
    //   !this.isOutOfRange(kingRow + 1, kingColumn - 1) &&
    //     this.chessboard[kingRow + 1][kingColumn - 1].type == PieceType.Pawn &&
    //     this.chessboard[kingRow + 1][kingColumn - 1].color == Color.White
    // );
    // console.log(kingRow + 1, kingColumn + 1);

    // if (
    //   !this.isOutOfRange(kingRow + 1, kingColumn - 1) &&
    //   this.chessboard[kingRow + 1][kingColumn - 1].type == PieceType.Pawn &&
    //   this.chessboard[kingRow + 1][kingColumn - 1].color == Color.White
    // )
    //   return true;
    // if (
    //   !this.isOutOfRange(kingRow + 1, kingColumn + 1) &&
    //   this.chessboard[kingRow + 1][kingColumn + 1].type == PieceType.Pawn &&
    //   this.chessboard[kingRow + 1][kingColumn + 1].color == Color.White
    // )
    //   return true;
    // if (
    //   ((this.chessboard[kingRow + 1][kingColumn - 1].type &&
    //     this.chessboard[kingRow + 1][kingColumn - 1].color === Color.Black) ||
    //     this.chessboard[kingRow + 1][kingColumn + 1].type) == PieceType.Pawn &&
    //   this.chessboard[kingRow + 1][kingColumn].color !== this.playerTurn
    // ) {
    //   return true;
    // }
    // if (
    //   ((this.chessboard[kingRow - 1][kingColumn - 1].type &&
    //     this.chessboard[kingRow - 1][kingColumn - 1].color === Color.White) ||
    //     this.chessboard[kingRow - 1][kingColumn + 1].type) == PieceType.Pawn &&
    //   this.chessboard[kingRow - 1][kingColumn].color !== this.playerTurn
    // ) {
    //   return true;
    // }

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

  checkIsOutOfRange(row: number, col: number): boolean {
    return row > 7 || row < 0 || col > 7 || col < 0 ? true : false;
  }

  // ==============================Pieces moveset functions==========================
  PawnMovesSet(pawn: IPiece): void {
    let direction: number = pawn.color == Color.White ? -1 : 1; //1 for black -1 for white
    this.setPawnValidCells(pawn.row + direction, pawn.column, pawn.color);
    //black first move
    if (pawn.row == 1 && pawn.color == Color.Black && this.chessboard[3][pawn.column].type == undefined) {
      this.chessboard[3][pawn.column].validCell = true;
    }
    //white first move
    if (pawn.row == 6 && pawn.color == Color.White && this.chessboard[4][pawn.column].type == undefined) {
      this.chessboard[4][pawn.column].validCell = true;
    }
  }

  RookMoveSet(tab: IPiece): void {
    // juz ograniczona out of range
    for (let i = tab.row - 1; i >= 0; i--) {
      //up
      if (this.checkIsValidCell(i, tab.column, tab.color)) {
        //truer if empty or enemy ; false = ally
        this.chessboard[i][tab.column].validCell = true;
        if (!!this.chessboard[i][tab.column].color) {
          break;
        }
      } else {
        break;
      }
    }
    for (let i = tab.row + 1; i < 8; i++) {
      //down

      if (this.checkIsValidCell(i, tab.column, tab.color)) {
        this.chessboard[i][tab.column].validCell = true;
        if (!!this.chessboard[i][tab.column].color) {
          break;
        }
      } else {
        break;
      }
    }
    for (let i = tab.column - 1; i >= 0; i--) {
      //left

      if (this.checkIsValidCell(tab.row, i, tab.color)) {
        this.chessboard[tab.row][i].validCell = true;
        if (!!this.chessboard[tab.row][i].color) {
          break;
        }
      } else {
        break;
      }
    }
    for (let i = tab.column + 1; i < 8; i++) {
      //right
      if (this.checkIsValidCell(tab.row, i, tab.color)) {
        this.chessboard[tab.row][i].validCell = true;
        if (!!this.chessboard[tab.row][i].color) {
          break;
        }
      } else {
        break;
      }
    }
  }

  KnightMoveSet(knight: IPiece): void {
    let j: number;
    for (let i = -2; i <= 2; i++) {
      if (i == 0) continue;
      if (i % 2 == 0) j = -1;
      else j = -2;
      for (let k = 0; k < 2; k++) {
        if (knight.row + i >= 0 && knight.row + i < 8 && knight.column + j >= 0 && knight.column + j < 8) {
          //is in array range
          if (this.checkIsValidCell(knight.row + i, knight.column + j, knight.color))
            this.chessboard[knight.row + i][knight.column + j].validCell = true;
        }
        j = j * -1;
      }
    }
  }

  BishopMoveSet(tab: IPiece): void {
    //diagonal up left

    for (let i = 1; i < 8; i++) {
      if (!this.checkIsOutOfRange(tab.row - i, tab.column - i)) {
        if (this.checkIsValidCell(tab.row - i, tab.column - i, tab.color)) {
          //truer if empty or enemy ; false = ally
          this.chessboard[tab.row - i][tab.column - i].validCell = true;
          if (!!this.chessboard[tab.row - i][tab.column - i].color) {
            break;
          }
        } else {
          break;
        }
      } else break;
    }
    //diagonal up right
    for (let i = 1; i < 8; i++) {
      if (!this.checkIsOutOfRange(tab.row - i, tab.column + i)) {
        if (this.checkIsValidCell(tab.row - i, tab.column + i, tab.color)) {
          //truer if empty or enemy ; false = ally
          this.chessboard[tab.row - i][tab.column + i].validCell = true;
          if (!!this.chessboard[tab.row - i][tab.column + i].color) {
            break;
          }
        } else {
          break;
        }
      } else break;
    }
    //diagonal down right
    for (let i = 1; i < 8; i++) {
      if (!this.checkIsOutOfRange(tab.row + i, tab.column + i)) {
        if (this.checkIsValidCell(tab.row + i, tab.column + i, tab.color)) {
          //truer if empty or enemy ; false = ally
          this.chessboard[tab.row + i][tab.column + i].validCell = true;
          if (!!this.chessboard[tab.row + i][tab.column + i].color) {
            break;
          }
        } else {
          break;
        }
      } else break;
    }

    // //diagonal down left
    for (let i = 1; i < 8; i++) {
      if (!this.checkIsOutOfRange(tab.row + i, tab.column - i)) {
        if (this.checkIsValidCell(tab.row + i, tab.column - i, tab.color)) {
          //truer if empty or enemy ; false = ally
          this.chessboard[tab.row + i][tab.column - i].validCell = true;
          if (!!this.chessboard[tab.row + i][tab.column - i].color) {
            break;
          }
        } else {
          break;
        }
      } else break;
    }
  }

  KingMoveSet(tab: IPiece): void {
    // tba => tabcell wkladana do funkjcji zbye ja przeskanowac

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (!this.checkIsOutOfRange(tab.row + i, tab.column + j)) {
          //check if is in array range then check pieces

          if (this.checkIsValidCell(tab.row + i, tab.column + j, tab.color))
            this.chessboard[tab.row + i][tab.column + j].validCell = true;
        }
      }
    }
  }

  QueenMoveSet(queen: IPiece): void {
    this.RookMoveSet(queen);
    this.BishopMoveSet(queen);
  }
}
