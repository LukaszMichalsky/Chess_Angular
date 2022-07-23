import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { Color, PieceType } from '../models/pieces';

export interface arrayPalletInterface {
  readonly type: PieceType;
  readonly limit: number;
  count: number;
}
@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  whitePiecesPallet: arrayPalletInterface[] = [
    { type: PieceType.King, limit: 1, count: 0 },
    { type: PieceType.Queen, limit: 1, count: 0 },
    { type: PieceType.Rook, limit: 2, count: 0 },
    { type: PieceType.Knight, limit: 2, count: 0 },
    { type: PieceType.Bishop, limit: 2, count: 0 },
    { type: PieceType.Pawn, limit: 8, count: 0 }
  ];

  blackPiecesPallet: arrayPalletInterface[] = [
    { type: PieceType.King, limit: 1, count: 0 },
    { type: PieceType.Queen, limit: 1, count: 0 },
    { type: PieceType.Rook, limit: 2, count: 0 },
    { type: PieceType.Knight, limit: 2, count: 0 },
    { type: PieceType.Bishop, limit: 2, count: 0 },
    { type: PieceType.Pawn, limit: 8, count: 0 }
  ];
  constructor() {}

  resetAll() {
    this.whitePiecesPallet.forEach((el) => (el.count = 0));
    this.blackPiecesPallet.forEach((el) => (el.count = 0));
  }
}
