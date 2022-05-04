import { Component, OnInit } from '@angular/core';
import { Color, IPiece, PieceType } from '../models/pieces';
import { LogicService } from '../service/logic.service';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss']
})
export class ChallengeComponent implements OnInit {
readonly keysOfPiecesType: (keyof typeof PieceType)[] = <(keyof typeof PieceType)[]>Object.keys(PieceType);
chessboard: IPiece[][] =[];
sidePiecesPallet: Array<{type:PieceType,color:Color}> =[];
vertical_index: number[] = [];
horizontal_index: String[] =[];
  constructor(private logicService: LogicService) {
    this.chessboard = logicService.chessboard;
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



    for (const key of this.keysOfPiecesType) {
      this.sidePiecesPallet.push({type: PieceType[key], color: Color.White})
      this.sidePiecesPallet.push({type: PieceType[key], color: Color.Black})
    }

  }

}


