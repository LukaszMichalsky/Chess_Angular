import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Color, IPiece, PieceType } from './models/pieces';

@Injectable({
  providedIn: 'root'
})
export class AppLogicService {

  chessboard$ = from(this.chessboardTemplate());

  PlayerTurn = Color.White;//true if white player turn / false if black player turn

  chessboardTemplate() : IPiece[][]
  {
    let chessboardTemplate: IPiece[][] = [];
    for(let i=0;i<8;i++)
    {
      chessboardTemplate[i] = [];
      for(let j=0;j<8;j++)
      {
        chessboardTemplate[i][j]= {
          "row":i,
          "column":j,
          "validCell":false
        };
      }
    }
    return chessboardTemplate;
  }

  constructor() {
   
    // this.setPieces();
   }
   //-----------------------FUNCTIONS------------------------
  // setPieces()//pierwsze ustawienie figur
  // {
  //   for(let i=0;i<8;i++)//pawns
  //   {
  //     this.chessboard$[1][i] = {
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
  //    //ROOKS
  //    this.chessboard[0][0]={"type": PieceType.Rook,"color": Color.Black,"row": 0,"column":0,"validCell": false};
  //    this.chessboard[0][7]={"type": PieceType.Rook,"color": Color.Black,"row": 0,"column":7,"validCell": false};
  //    this.chessboard[7][0]={"type": PieceType.Rook,"color": Color.White,"row": 7,"column":0,"validCell": false};
  //    this.chessboard[7][7]={"type": PieceType.Rook,"color": Color.White,"row": 7,"column":7,"validCell": false};
  //    //KNIGHTS
  //    this.chessboard[0][1]={"type": PieceType.Knight,"color": Color.Black,"row": 0,"column":1,"validCell": false};
  //    this.chessboard[0][6]={"type": PieceType.Knight,"color": Color.Black,"row": 0,"column":6,"validCell": false};
  //    this.chessboard[7][1]={"type": PieceType.Knight,"color": Color.White,"row": 7,"column":1,"validCell": false};
  //    this.chessboard[7][6]={"type": PieceType.Knight,"color": Color.White,"row": 7,"column":6,"validCell": false};
  //    //BISHOPS
  //    this.chessboard[0][2]={"type": PieceType.Bishop,"color": Color.Black,"row": 0,"column":2,"validCell": false};
  //    this.chessboard[0][5]={"type": PieceType.Bishop,"color": Color.Black,"row": 0,"column":5,"validCell": false};
  //    this.chessboard[7][2]={"type": PieceType.Bishop,"color": Color.White,"row": 7,"column":2,"validCell": false};
  //    this.chessboard[7][5]={"type": PieceType.Bishop,"color": Color.White,"row": 7,"column":5,"validCell": false};
  //    //QUEENS
  //    this.chessboard[0][4]={"type": PieceType.Queen,"color": Color.Black,"row": 0,"column":4,"validCell": false};
  //    this.chessboard[7][3]={"type": PieceType.Queen,"color": Color.White,"row": 7,"column":3,"validCell": false};
  //    //KINGS
  //    this.chessboard[0][3]={"type": PieceType.King,"color": Color.Black,"row": 0,"column":3,"validCell": false};
  //    this.chessboard[7][4]={"type": PieceType.King,"color": Color.White,"row": 7,"column":4,"validCell": false};
  // }
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
  //==============================Pieces moveset functions==========================
//   PawnMovesSet(tab: IPiece){}

//   RookMoveSet(tab: IPiece)
//   {
//     for(let i=tab.row-1;i>=0;i--)//from piece to up
//         {
//           if(this.setValidCell(i,tab.column,tab.color))
//             break;
//         }
//         for(let i=tab.row+1;i<8;i++)//from piece to down
//         {
//           if(this.setValidCell(i,tab.column,tab.color))
//             break;
//         }
//         for(let i=tab.column-1;i>=0;i--)//from piece to left
//         {
//           if(this.setValidCell(tab.row,i,tab.color))
//             break;
//         }
//         for(let i=tab.column+1;i<8;i++)//from piece to to right
//         {
//           if(this.setValidCell(tab.row,i,tab.color))
//             break;
//         }
//   }

//   KnightMoveSet(tab: IPiece)
//   {
//     let j:number;
//         for(let i=-2;i<=2;i++)
//         {
//           if(i==0) continue;
//           if(i%2==0) j=-1;
//           else j=-2;
//           for(let k=0;k<2;k++)
//           {
//             if(tab.row+i>=0 && tab.row+i<8 && tab.column+j>=0 && tab.column+j<8 )//is in array range
//             {
//               this.setValidCell(tab.row+i,tab.column+j,tab.color);
//             }
//             j=j*-1;
//           }
//         }
//   }

//   BishopMoveSet(tab:IPiece)
//   {
//     for(let i=1;i<8;i++)//diagonal up left
//     {
//       if(tab.row-i<0 || tab.column-i<0 || this.setValidCell(tab.row-i,tab.column-i,tab.color))
//         break;
//     }
//     for(let i=1;i<8;i++)//diagonal up right
//     {
//       if(tab.row-i<0 || tab.column+i>7 || this.setValidCell(tab.row-i,tab.column+i,tab.color))
//         break;
//     }
//     for(let i=1;i<8;i++)//diagonal down right
//     {
//       if(tab.row+i>7 || tab.column+i>7 || this.setValidCell(tab.row+i,tab.column+i,tab.color))
//         break;
//     }
//     for(let i=1;i<8;i++)//diagonal down left
//     {
//       if(tab.row+i>7 || tab.column-i<0 || this.setValidCell(tab.row+i,tab.column-i,tab.color))
//         break;
//     }
//   }

//   KingMoveSet(tab: IPiece)
//   {
//     for(let i=-1;i<2;i++)
//     {
//       for(let j=-1;j<2;j++)
//       {
//         if(tab.row+i>0 && tab.row+i<8 && tab.column+i>0 && tab.column+i<8 )//is in array range
//         {
//           this.setValidCell(tab.row+i,tab.column+j,tab.color);
//         }
//       }
//     }
//   }

 }
