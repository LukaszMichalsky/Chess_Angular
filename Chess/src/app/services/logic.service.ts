import { Injectable, OnInit } from '@angular/core';
import { Color, PieceInterface, PieceType } from '../models/pieces';

export interface kingCastling {
  canCastling: boolean;
  leftRookMoved: boolean;
  rightRookMoved: boolean;
  kingMoved: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LogicService implements OnInit {
  public vertical_index: number[] = [];
  public horizontal_index: String[] = [];
  public chessboard: PieceInterface[][];
  public playerTurn = Color.White; //true if white player turn / false if black player turn
  public isNewGame: boolean = true;
  public isCheck: boolean = false; //after turn check check

  public whiteKingCastling: kingCastling = {
    canCastling: true,
    leftRookMoved: false,
    rightRookMoved: false,
    kingMoved: false
  };

  public blackKingCastling: kingCastling = {
    canCastling: true,
    leftRookMoved: false,
    rightRookMoved: false,
    kingMoved: false
  };

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

  //CASTLING RULES
  // król nie jest szachowany DONE
  // przed roszadą ani król, ani wieża nie wykonali żadnego ruchu done
  // pomiędzy królem, a wieżą nie stoją inne figury[3] ez done

  // po roszadzie nie może znaleźć się pod szachem

  // król nie może przeskoczyć przez zaatakowane pole

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

  checkIsCheck(row?: number, col?: number): boolean {
    let kingColumn;
    let kingRow;
    if (row && col) {
      kingColumn = col;
      kingRow = row;
    } else {
      this.searchKings();
      if (this.playerTurn === Color.White) {
        // search which turn is and set kings positions
        kingColumn = this._whiteLKingPosition.col;
        kingRow = this._whiteLKingPosition.row;
      } else {
        kingColumn = this._blackKingPosition.col;
        kingRow = this._blackKingPosition.row;
      }
    }
    // if (kingColumn - 1 < 0 || kingColumn + 1 > 7)
    if (this.playerTurn === Color.White) {
      if (kingColumn + 1 < 8)
        if (
          this.chessboard[kingRow - 1][kingColumn + 1].type === PieceType.Pawn &&
          this.chessboard[kingRow - 1][kingColumn + 1].color === Color.Black
        ) {
          return true;
        }
      if (kingColumn - 1 >= 0)
        if (
          this.chessboard[kingRow - 1][kingColumn - 1].type === PieceType.Pawn &&
          this.chessboard[kingRow - 1][kingColumn - 1].color === Color.Black
        ) {
          return true;
        }
    } else {
      if (kingColumn + 1 < 8)
        if (
          this.chessboard[kingRow + 1][kingColumn + 1].type === PieceType.Pawn &&
          this.chessboard[kingRow + 1][kingColumn + 1].color === Color.White
        ) {
          return true;
        }
      if (kingColumn - 1 >= 0)
        if (
          this.chessboard[kingRow + 1][kingColumn - 1].type === PieceType.Pawn &&
          this.chessboard[kingRow + 1][kingColumn - 1].color === Color.White
        ) {
          return true;
        }
    }

    //check is king
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (!this.checkIsOutOfRange(kingRow + i, kingColumn + j)) {
          //check if is in array range then check pieces

          if (
            this.chessboard[kingRow + i][kingColumn + j].type === PieceType.King &&
            this.chessboard[kingRow + i][kingColumn + j].color !== this.playerTurn
          )
            return true;
        }
      }
    }

    //check knight
    let j: number;
    for (let i = -2; i <= 2; i++) {
      if (i == 0) continue;
      if (i % 2 == 0) j = -1;
      else j = -2;
      for (let k = 0; k < 2; k++) {
        if (!this.checkIsOutOfRange(kingRow + i, kingColumn + j)) {
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
    for (let i = kingRow - 1; i >= 0; i--) {
      //up
      if (this.checkIsValidCell(i, kingColumn, this.playerTurn)) {
        if (
          this.chessboard[i][kingColumn].type === PieceType.Rook ||
          this.chessboard[i][kingColumn].type === PieceType.Queen
        ) {
          return true;
        }
        if (this.chessboard[i][kingColumn].type) break;
      } else break;
    }
    for (let i = kingRow + 1; i < 8; i++) {
      //down
      if (this.checkIsValidCell(i, kingColumn, this.playerTurn)) {
        if (
          this.chessboard[i][kingColumn].type === PieceType.Rook ||
          this.chessboard[i][kingColumn].type === PieceType.Queen
        ) {
          return true;
        }
        if (this.chessboard[i][kingColumn].type) break;
      } else break;
    }

    for (let i = kingColumn - 1; i >= 0; i--) {
      //left
      if (this.checkIsValidCell(kingRow, i, this.playerTurn)) {
        if (
          this.chessboard[kingRow][i].type === PieceType.Rook ||
          this.chessboard[kingRow][i].type === PieceType.Queen
        ) {
          return true;
        }
        if (this.chessboard[kingRow][i].type) break;
      } else break;
    }

    for (let i = kingColumn + 1; i < 8; i++) {
      //right
      if (this.checkIsValidCell(kingRow, i, this.playerTurn)) {
        if (
          this.chessboard[kingRow][i].type === PieceType.Rook ||
          this.chessboard[kingRow][i].type === PieceType.Queen
        ) {
          return true;
        }
        if (this.chessboard[kingRow][i].type) break;
      } else break;
    }

    //diagonal leftUp
    for (let i = 1; i < 8; i++) {
      if (!this.checkIsOutOfRange(kingRow - i, kingColumn - i)) {
        if (this.checkIsValidCell(kingRow - i, kingColumn - i, this.playerTurn)) {
          if (
            this.chessboard[kingRow - i][kingColumn - i].type === PieceType.Bishop ||
            this.chessboard[kingRow - i][kingColumn - i].type === PieceType.Queen
          ) {
            return true;
          }
        } else {
          break;
        }
      } else break;
    }

    //diagonal upRight
    for (let i = 1; i < 8; i++) {
      if (!this.checkIsOutOfRange(kingRow - i, kingColumn + i)) {
        if (this.checkIsValidCell(kingRow - i, kingColumn + i, this.playerTurn)) {
          if (
            this.chessboard[kingRow - i][kingColumn + i].type === PieceType.Bishop ||
            this.chessboard[kingRow - i][kingColumn + i].type === PieceType.Queen
          ) {
            return true;
          }
        } else {
          break;
        }
      } else break;
    }

    //diagonal downRight
    for (let i = 1; i < 8; i++) {
      if (!this.checkIsOutOfRange(kingRow + i, kingColumn + i)) {
        if (this.checkIsValidCell(kingRow + i, kingColumn + i, this.playerTurn)) {
          if (
            this.chessboard[kingRow + i][kingColumn + i].type === PieceType.Bishop ||
            this.chessboard[kingRow + i][kingColumn + i].type === PieceType.Queen
          ) {
            return true;
          }
        } else {
          break;
        }
      } else break;
    }

    //diagonal downLeft
    for (let i = 1; i < 8; i++) {
      if (!this.checkIsOutOfRange(kingRow + i, kingColumn - i)) {
        if (this.checkIsValidCell(kingRow + i, kingColumn - i, this.playerTurn)) {
          if (
            this.chessboard[kingRow + i][kingColumn - i].type === PieceType.Bishop ||
            this.chessboard[kingRow + i][kingColumn - i].type === PieceType.Queen
          ) {
            return true;
          }
        } else {
          break;
        }
      } else break;
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

  checkIsOutOfRange(row: number, col: number): boolean {
    return row > 7 || row < 0 || col > 7 || col < 0 ? true : false;
  }

  castlingMove(cell: PieceInterface): void {
    //pole jest valid cellem => warunki roszady spelnione i rusza sie krol
    if (cell.row === 0 && !this.blackKingCastling.kingMoved) {
      //black castling
      if (cell.column === 1) {
        this.clearCell(0, 0);
        this.chessboard[0][2].type = PieceType.Rook;
        this.chessboard[0][2].color = Color.Black;
      } else if (cell.column === 5) {
        this.clearCell(0, 7);
        this.chessboard[0][4].type = PieceType.Rook;
        this.chessboard[0][4].color = Color.Black;
      }
    } else if (cell.row === 7 && !this.whiteKingCastling.kingMoved) {
      //white castling
      if (cell.column === 6) {
        this.clearCell(7, 7);
        this.chessboard[7][5].type = PieceType.Rook;
        this.chessboard[7][5].color = Color.White;
      } else if (cell.column === 2) {
        this.clearCell(7, 0);
        this.chessboard[7][3].type = PieceType.Rook;
        this.chessboard[7][3].color = Color.White;
      }
    }
  }

  rookMoved(rook: PieceInterface): void {
    if (this.playerTurn === Color.White) {
      rook.column === 0
        ? (this.whiteKingCastling.leftRookMoved = true)
        : (this.whiteKingCastling.rightRookMoved = true);
    } else {
      rook.column === 0
        ? (this.blackKingCastling.leftRookMoved = true)
        : (this.blackKingCastling.rightRookMoved = true);
    }
  }

  kingMoved(): void {
    this.playerTurn === Color.White
      ? (this.whiteKingCastling.kingMoved = true)
      : (this.blackKingCastling.kingMoved = true);
  }

  clearCell(row: number, col: number): void {
    this.chessboard[row][col].type = undefined;
    this.chessboard[row][col].color = undefined;
  }

  // ==============================Pieces moveset functions==========================
  PawnMovesSet(pawn: PieceInterface): void {
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

  RookMoveSet(rook: PieceInterface): void {
    // juz ograniczona out of range
    for (let i = rook.row - 1; i >= 0; i--) {
      //up
      if (this.checkIsValidCell(i, rook.column, rook.color)) {
        //truer if empty or enemy ; false = ally
        this.chessboard[i][rook.column].validCell = true;
        if (!!this.chessboard[i][rook.column].color) {
          break;
        }
      } else {
        break;
      }
    }
    for (let i = rook.row + 1; i < 8; i++) {
      //down
      if (this.checkIsValidCell(i, rook.column, rook.color)) {
        this.chessboard[i][rook.column].validCell = true;
        if (!!this.chessboard[i][rook.column].color) {
          break;
        }
      } else {
        break;
      }
    }
    for (let i = rook.column - 1; i >= 0; i--) {
      //left

      if (this.checkIsValidCell(rook.row, i, rook.color)) {
        this.chessboard[rook.row][i].validCell = true;
        if (!!this.chessboard[rook.row][i].color) {
          break;
        }
      } else {
        break;
      }
    }
    for (let i = rook.column + 1; i < 8; i++) {
      //right
      if (this.checkIsValidCell(rook.row, i, rook.color)) {
        this.chessboard[rook.row][i].validCell = true;
        if (!!this.chessboard[rook.row][i].color) {
          break;
        }
      } else {
        break;
      }
    }
  }

  KnightMoveSet(knight: PieceInterface): void {
    let j: number;
    for (let i = -2; i <= 2; i++) {
      if (i == 0) continue;
      if (i % 2 == 0) j = -1;
      else j = -2;
      for (let k = 0; k < 2; k++) {
        if (!this.checkIsOutOfRange(knight.row + i, knight.column + j)) {
          if (this.checkIsValidCell(knight.row + i, knight.column + j, knight.color))
            this.chessboard[knight.row + i][knight.column + j].validCell = true;
        }
        j = j * -1;
      }
    }
  }

  BishopMoveSet(bishop: PieceInterface): void {
    //diagonal up left

    for (let i = 1; i < 8; i++) {
      if (!this.checkIsOutOfRange(bishop.row - i, bishop.column - i)) {
        if (this.checkIsValidCell(bishop.row - i, bishop.column - i, bishop.color)) {
          this.chessboard[bishop.row - i][bishop.column - i].validCell = true;
          if (!!this.chessboard[bishop.row - i][bishop.column - i].color) {
            break;
          }
        } else {
          break;
        }
      } else break;
    }
    //diagonal up right
    for (let i = 1; i < 8; i++) {
      if (!this.checkIsOutOfRange(bishop.row - i, bishop.column + i)) {
        if (this.checkIsValidCell(bishop.row - i, bishop.column + i, bishop.color)) {
          this.chessboard[bishop.row - i][bishop.column + i].validCell = true;
          if (!!this.chessboard[bishop.row - i][bishop.column + i].color) {
            break;
          }
        } else {
          break;
        }
      } else break;
    }
    //diagonal down right
    for (let i = 1; i < 8; i++) {
      if (!this.checkIsOutOfRange(bishop.row + i, bishop.column + i)) {
        if (this.checkIsValidCell(bishop.row + i, bishop.column + i, bishop.color)) {
          this.chessboard[bishop.row + i][bishop.column + i].validCell = true;
          if (!!this.chessboard[bishop.row + i][bishop.column + i].color) {
            break;
          }
        } else {
          break;
        }
      } else break;
    }

    // //diagonal down left
    for (let i = 1; i < 8; i++) {
      if (!this.checkIsOutOfRange(bishop.row + i, bishop.column - i)) {
        if (this.checkIsValidCell(bishop.row + i, bishop.column - i, bishop.color)) {
          this.chessboard[bishop.row + i][bishop.column - i].validCell = true;
          if (!!this.chessboard[bishop.row + i][bishop.column - i].color) {
            break;
          }
        } else {
          break;
        }
      } else break;
    }
  }

  KingMoveSet(king: PieceInterface): void {
    // tba => tabcell wkladana do funkjcji zbye ja przeskanowac

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (!this.checkIsOutOfRange(king.row + i, king.column + j)) {
          //check if is in array range then check pieces

          if (this.checkIsValidCell(king.row + i, king.column + j, king.color))
            this.chessboard[king.row + i][king.column + j].validCell = true;
        }
      }
    }
    if (!this.checkIsCheck()) {
      if (king.color === Color.White) {
        if (!this.whiteKingCastling.kingMoved && this.whiteKingCastling.canCastling) {
          //left side
          if (!this.whiteKingCastling.leftRookMoved) {
            if (
              this.chessboard[7][1].type === undefined &&
              this.chessboard[7][2].type === undefined &&
              this.chessboard[7][3].type === undefined &&
              !this.checkIsCheck(7, 2) &&
              !this.checkIsCheck(7, 3)
            ) {
              this.chessboard[7][2].validCell = true;
            }
          }
          //right side
          if (!this.whiteKingCastling.rightRookMoved) {
            if (
              this.chessboard[7][5].type === undefined &&
              this.chessboard[7][6].type === undefined &&
              !this.checkIsCheck(7, 6) &&
              !this.checkIsCheck(7, 5)
            ) {
              this.chessboard[7][6].validCell = true;
            }
          }
        }
      } else {
        if (!this.blackKingCastling.kingMoved && this.blackKingCastling.canCastling) {
          //right side
          if (!this.blackKingCastling.rightRookMoved) {
            if (
              this.chessboard[0][4].type === undefined &&
              this.chessboard[0][5].type === undefined &&
              this.chessboard[0][6].type === undefined &&
              !this.checkIsCheck(0, 5) &&
              !this.checkIsCheck(0, 4)
            ) {
              this.chessboard[0][5].validCell = true;
            }
          }
          //left side
          if (!this.whiteKingCastling.leftRookMoved) {
            if (
              this.chessboard[0][1].type === undefined &&
              this.chessboard[0][2].type === undefined &&
              !this.checkIsCheck(0, 1) &&
              !this.checkIsCheck(0, 2)
            ) {
              this.chessboard[0][1].validCell = true;
            }
          }
        }
      }
    }
  }

  QueenMoveSet(queen: PieceInterface): void {
    this.RookMoveSet(queen);
    this.BishopMoveSet(queen);
  }
}
//jenda petla z flagami chyba gorsza niz kilka petli przerywajacych sie bo za kazdymn razem musi i tak sprawdzac jak jede tru to wejdz do niego
