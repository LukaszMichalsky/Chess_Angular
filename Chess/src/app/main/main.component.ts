import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-component',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
   
  vertical_index: number[] = [];
  horizontal_index: String[] =[];

  
  constructor() {
    for(let i=1;i<9;i++)
    {
      this.horizontal_index[i-1]=String.fromCharCode(i+64);
      this.vertical_index[i-1]=i;
    }//stworzenie i zainicjalizowanie 2 tablic dla indeksow bo latwiej niz wpisywac recznie tablice dla ngfor
    //obie sa w kolejnosci roznacej ale vert index wyswietlic odwrotnie
  }
  ngOnInit(): void {
  }

}
