import { Component, OnInit } from '@angular/core';
import { Piece } from '../models/pieces';

@Component({
  selector: 'app-main-component',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
   
  vertical_index: number[] = [];
  horizontal_index: String[] =[];
  chessboard: Piece[][]=[];
  
  constructor() {
    for(let i=1;i<9;i++)
    {
      this.horizontal_index[i-1]=String.fromCharCode(i+64);
      this.vertical_index[i-1]=i;
    }
    this.vertical_index.reverse();
    //stworzenie i zainicjalizowanie 2 tablic dla indeksow bo latwiej niz wpisywac recznie tablice dla ngfor
    //obie sa w kolejnosci roznacej ale vert index wyswietlic odwrotnie
    //odwrocenie bo na odwrot trzeba wyswietlic dolny lewy a1 dla bialych na dole
  }



  ngOnInit(): void {
  }

}
