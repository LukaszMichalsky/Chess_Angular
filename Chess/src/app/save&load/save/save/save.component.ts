import { Component, OnInit } from '@angular/core';
import { ExportToCsv } from 'export-to-csv';
import { IPiece } from 'src/app/models/pieces';
import { LogicService} from '../../../service/logic.service'

@Component({
  selector: 'save-component',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.css']
})
export class SaveComponent implements OnInit {

  options ={
    fieldSeparator: ',',
    quoteStrings: '',
    decimalSeparator: '.',
    showLabels: true, 
    showTitle: false,
    filename: 'Chess_game',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: false,
  }

  constructor(
   private readonly logicService: LogicService
  ) { }

  ngOnInit(): void {
  }

  saveToFile(){
    const csvExporter = new ExportToCsv(this.options);
    csvExporter.generateCsv(this.filterData() );
  }

  filterData(): Array<any>{
    const data: IPiece[][] = this.logicService.chessboard;
    let dataToSave: Array<any> =[];

    for(let i=0;i<8;i++){
      for(let j=0;j<8;j++){
        if(data[i][j].type != undefined){
          let cleanData ={
            row: data[i][j].row,
            column: data[i][j].column,     
            type: data[i][j].type,
            color: data[i][j].color
          }
          dataToSave.push(cleanData);
        }
      }
    }
    return dataToSave;
  }
}