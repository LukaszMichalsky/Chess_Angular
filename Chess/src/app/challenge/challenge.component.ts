import { Component, OnInit } from '@angular/core';
import { Color, IPiece, PieceType } from '../models/pieces';
import { LogicService } from '../services/logic.service';

export interface arrayPalletInterface {
  type: PieceType;
  readonly limit: number;
  count: number;
}
@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss']
})
export class ChallengeComponent implements OnInit {
  readonly keysOfPiecesType: (keyof typeof PieceType)[] = <(keyof typeof PieceType)[]>Object.keys(PieceType);
  chessboard: IPiece[][] = [];
  sidePiecesPallet: Array<{ type: PieceType; color: Color }> = [];
  vertical_index: number[] = [];
  horizontal_index: String[] = [];

  whitePieces: arrayPalletInterface[] = [
    { type: PieceType.King, limit: 1, count: 0 },
    { type: PieceType.Queen, limit: 1, count: 0 },
    { type: PieceType.Rook, limit: 2, count: 0 },
    { type: PieceType.Knight, limit: 2, count: 0 },
    { type: PieceType.Bishop, limit: 2, count: 0 },
    { type: PieceType.Pawn, limit: 8, count: 0 }
  ];
  blackPieces: arrayPalletInterface;

  dataTransfer: Element;

  constructor(private logicService: LogicService) {
    this.chessboard = logicService.chessboard;
  }

  ngOnInit(): void {
    for (let i = 1; i < 9; i++) {
      this.horizontal_index[i - 1] = String.fromCharCode(i + 64);
      this.vertical_index[i - 1] = i;
    }
    this.vertical_index.reverse();
    //stworzenie i zainicjalizowanie 2 tablic dla indeksow bo latwiej niz wpisywac recznie tablice dla ngfor
    //obie sa w kolejnosci roznacej ale vert index wyswietlic odwrotnie
    //odwrocenie bo na odwrot trzeba wyswietlic dolny lewy a1 dla bialych na dole

    for (const key of this.keysOfPiecesType) {
      this.sidePiecesPallet.push({ type: PieceType[key], color: Color.White });
      this.sidePiecesPallet.push({ type: PieceType[key], color: Color.Black });
    }
  }

  allowDrop($event: Event) {
    $event.preventDefault();
  }

  onDrag($event: any) {
    $event.effectAllowed = 'clone';
    this.dataTransfer = $event.target.cloneNode();
  }

  onDrop($event: any) {
    $event.stopPropagation();
    $event.target.appendChild(this.dataTransfer);
  }

  // startDragging($event: any) {
  //   console.log('start');
  //   $event.effectAllowed = 'clone';
  //   $event.dataTransfer.setData('text', $event.target);
  // }

  // endDragging($event: Event) {
  //   console.log('asdsa', $event.target);
  // }

  // onDragLeave($event: Event) {
  //   $event.stopPropagation();
  //   $event.preventDefault();
  // }

  //  onDragEnter($event) {}

  // onDrop($event: Event) {
  //   $event.stopPropagation();
  // }
}
