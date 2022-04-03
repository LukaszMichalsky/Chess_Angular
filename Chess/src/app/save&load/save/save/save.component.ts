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

  data: IPiece[] = this.filterData();

  options ={
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true, 
    showTitle: true,
    filename: 'Chess_game',
    title: 'Chess save',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
  }

  constructor(
   private readonly logicService: LogicService
  ) { }

  ngOnInit(): void {
  }

  saveToFile(){
    const csvExporter = new ExportToCsv(this.options);
    csvExporter.generateCsv(this.data);
  }

  filterData(): IPiece[]{
    const data: IPiece[][] = this.logicService.chessboard;
    let cleanData: any;
    let counter =0;
    for(let i=0;i<8;i++){
      for(let j=0;j<8;j++){
        if(data[i][j].type !== undefined){
           cleanData[counter] = data[i][j];
         
        }
      }
    }
    console.log(cleanData); 
    return cleanData;
  }
}