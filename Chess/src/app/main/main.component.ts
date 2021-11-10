import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IPiece,Color,PieceType } from '../models/pieces';

@Component({
  selector: 'app-main-component',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  vertical_index: number[] = [];
  horizontal_index: String[] =[];
  chessboard: IPiece[][];
  validCell: boolean=false;

  constructor() {

    this.chessboard = [];
    for(let i=0;i<8;i++)
    {
      this.chessboard[i] = [];
      for(let j=0;j<8;j++)
      {
        this.chessboard[i][j]= {
          "row":i,
          "column":j
        };
      }
    }

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
    this.setPieces();
  }

  setPieces()//pierwsze ustawienie figur
  {
    for(let i=0;i<8;i++)//pawns
    {
      this.chessboard[1][i] = {
        "type": PieceType.Pawn,
        "color": Color.Black,
        "row": 1,
        "column": i,
        "validCell": false
      };
      this.chessboard[6][i] = {
        "type": PieceType.Pawn,
        "color": Color.White,
        "row": 6,
        "column": i,
        "validCell": false
      }
    }
    //ROOKS
    this.chessboard[0][0]={"type": PieceType.Rook,"color": Color.Black,"row": 0,"column":0,"validCell": false};
    this.chessboard[0][7]={"type": PieceType.Rook,"color": Color.Black,"row": 0,"column":7,"validCell": false};
    this.chessboard[7][0]={"type": PieceType.Rook,"color": Color.White,"row": 7,"column":0,"validCell": false};
    this.chessboard[7][7]={"type": PieceType.Rook,"color": Color.White,"row": 7,"column":7,"validCell": false};
    //BISHOPS
    this.chessboard[0][1]={"type": PieceType.Bishop,"color": Color.Black,"row": 0,"column":1,"validCell": false};
    this.chessboard[0][6]={"type": PieceType.Bishop,"color": Color.Black,"row": 0,"column":6,"validCell": false};
    this.chessboard[7][1]={"type": PieceType.Bishop,"color": Color.White,"row": 7,"column":1,"validCell": false};
    this.chessboard[7][6]={"type": PieceType.Bishop,"color": Color.White,"row": 7,"column":6,"validCell": false};
    //KNIGHTS
    this.chessboard[0][2]={"type": PieceType.Knight,"color": Color.Black,"row": 0,"column":2,"validCell": false};
    this.chessboard[0][5]={"type": PieceType.Knight,"color": Color.Black,"row": 0,"column":5,"validCell": false};
    this.chessboard[7][2]={"type": PieceType.Knight,"color": Color.White,"row": 7,"column":2,"validCell": false};
    this.chessboard[7][5]={"type": PieceType.Knight,"color": Color.White,"row": 7,"column":5,"validCell": false};
    //QUEENS
    this.chessboard[0][4]={"type": PieceType.Queen,"color": Color.Black,"row": 0,"column":4,"validCell": false};
    this.chessboard[7][3]={"type": PieceType.Queen,"color": Color.White,"row": 7,"column":3,"validCell": false};
    //KINGS
    this.chessboard[0][3]={"type": PieceType.King,"color": Color.Black,"row": 0,"column":3,"validCell": false};
    this.chessboard[7][4]={"type": PieceType.King,"color": Color.White,"row": 7,"column":4,"validCell": false};

  }

  validMoves(tab: any )
  {
    if(tab!=null)
    switch(tab.type)
    {
      case "Pawn":{

      }
      break;
      case "Rook":{
        for(let i=0;i<8;i++)
        {
          if(tab.row==i)
          {

          }
        }
      }
      break;
      case "Knight":{

      }
      break;
      case "Bishop":{

      }
      break;
      case "Queen":{

      }
      break;
      case "King":{

      }
      break;
    }
  }

}


