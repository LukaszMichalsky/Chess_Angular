import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LogicService } from 'src/app/service/logic.service';


@Component({
  selector: 'load-component',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.css']
})
export class LoadComponent implements OnInit {

  listOfPieces: any;
  size: number =0;
  constructor(
    private logicService: LogicService,
    private router: Router,

  ) { }

  ngOnInit(): void {
  }

  @ViewChild('fileInput') fileInput: any;


  dataParser(event: any): void
  {
    const files = event.target.files;

  // result structure => [row, column, type, color]
    for(let i=0;i<this.size;i++)
    {
      this.logicService.chessboard[this.listOfPieces[0]][this.listOfPieces[1]].type = this.listOfPieces[2]
      this.logicService.chessboard[this.listOfPieces[0]][this.listOfPieces[1]].color = this.listOfPieces[3]
    }
  }

  loadGame($event: any)
  {
    this.logicService.isNewGame = false;
    this.logicService.clearChessboard();
    this.dataParser($event);
    this.router.navigate(['/game']);
  }
}
