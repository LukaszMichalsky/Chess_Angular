import { Component, ElementRef, OnInit, Query, QueryList, ViewChildren } from '@angular/core';
import { Color, PieceInterface, PieceType } from '../models/pieces';
import { arrayPalletInterface, ChallengeService } from '../services/challenge.service';
import { LogicService } from '../services/logic.service';
@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss']
})
export class ChallengeComponent implements OnInit {
  @ViewChildren('chessboardCell') chessboardCells: QueryList<ElementRef>;
  @ViewChildren('palletCell') palletCells: QueryList<ElementRef>;
  readonly keysOfPiecesType: (keyof typeof PieceType)[] = <(keyof typeof PieceType)[]>Object.keys(PieceType);
  whitePiecesPallet: arrayPalletInterface[];
  blackPiecesPallet: arrayPalletInterface[];
  chessboard: PieceInterface[][] = [];
  sidePiecesPallet: Array<{ type: PieceType; color: Color }> = [];
  vertical_index: number[] = [];
  horizontal_index: String[] = [];
  dataTransfer: Element;
  cellData: PieceInterface;
  private _pieceId: any;

  constructor(private logicService: LogicService, private challengeService: ChallengeService) {
    this.chessboard = logicService.chessboard;
    this.whitePiecesPallet = challengeService.whitePiecesPallet;
    this.blackPiecesPallet = challengeService.blackPiecesPallet;
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
    this._pieceId = $event.target.id.toString();
    console.log(this._pieceId, this.cellData);

    // this._pieceId.includes(Color.White) ? this.cellData.color = Color.White :this.cellData.color = Color.Black
    let val = this._pieceId.includes(Color.White)
      ? (this.whitePiecesPallet.find(({ type }) => type === this._pieceId.substring(6)))
      : (this.blackPiecesPallet.find(({ type }) => type === this._pieceId.substring(6)));

    if (val) {
      if (val.count < val.limit) {
        val.count++;
      } else {
        $event.target.draggable = false;
      }

      if (val.count < val.limit) {
        val.count++;
      } else {
        $event.target.draggable = false;
      }
    }

    this.dataTransfer = $event.target.cloneNode();

    this.cellData.type = val?.type;
    this.cellData.validCell = false;
  }

  onDrop($event: any) {
    $event.stopPropagation();
    $event.target.appendChild(this.dataTransfer);
    // this.de
    // this.chessboard[][] = this.cellData
    $event.target.firstChild.draggable = false;
  }

  resetAll() {
    this.chessboardCells.forEach((cell) => {
      if (cell.nativeElement.firstChild) cell.nativeElement.firstChild.remove();
    });
    this.palletCells.forEach((cell) => {
      cell.nativeElement.draggable = true;
    });
    this.challengeService.resetAll();
  }
  // trackByPiece(index: number, item: any): PieceType {
  //   return item;
  // }
}
