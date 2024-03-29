import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PieceInterface } from 'src/app/models/pieces';
import { LogicService } from '../../services/logic.service';

@Component({
  selector: 'save-component',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss']
})
export class SaveComponent {
  // options = {
  //   fieldSeparator: ',',
  //   quoteStrings: '',
  //   decimalSeparator: '.',
  //   showLabels: true,
  //   showTitle: false,
  //   filename: 'Chess_game',
  //   useTextFile: false,
  //   useBom: true,
  //   useKeysAsHeaders: false
  // };
  fileUrl: any;

  constructor(private sanitizer: DomSanitizer, private readonly logicService: LogicService) {}

  saveToFile() {
    let json = JSON.stringify(this.filterData());
    let blob = new Blob([json], { type: 'application/json' });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }

  filterData(): Array<any> {
    const data: PieceInterface[][] = this.logicService.chessboard;
    let dataToSave: Array<any> = [];
    dataToSave.push({ playerTurn: this.logicService.playerTurn });

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (data[i][j].type != undefined) {
          let cleanData = {
            row: data[i][j].row,
            column: data[i][j].column,
            type: data[i][j].type,
            color: data[i][j].color
          };
          dataToSave.push(cleanData);
        }
      }
    }

    return dataToSave;
  }
}
