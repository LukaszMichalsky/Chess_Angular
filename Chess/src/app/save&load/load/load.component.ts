import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LogicService } from 'src/app/services/logic.service';

@Component({
  selector: 'load-component',
  templateUrl: './load.component.html'
})
export class LoadComponent implements OnInit {
  @ViewChild('loadInput') loadInput: ElementRef;
  listOfPieces: any;
  size: number = 0;
  constructor(private logicService: LogicService, private router: Router) {}

  ngOnInit(): void {}

  dataParser(data: any): void {
    this.listOfPieces = JSON.parse(data);
    this.logicService.playerTurn = this.listOfPieces[0].playerTurn;
    this.listOfPieces.shift();
    for (let piece of this.listOfPieces) {
      this.logicService.chessboard[piece.row][piece.column].type = piece.type;
      this.logicService.chessboard[piece.row][piece.column].color = piece.color;
    }
  }

  loadGame($event: any) {
    this.logicService.isNewGame = false;
    this.logicService.clearChessboard();
    let file = $event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = () => {
      this.dataParser(fileReader.result);
    };
    fileReader.onerror = (error) => {
      console.log(error);
    };



    this.router.navigate(['/game']);
  }

  loadFile() {
    this.loadInput.nativeElement.click();
  }
}
