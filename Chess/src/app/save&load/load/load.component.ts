import { Component, OnInit } from '@angular/core';
import { LogicService } from 'src/app/service/logic.service';

@Component({
  selector: 'load-component',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.css']
})
export class LoadComponent implements OnInit {

  constructor(
    logicService: LogicService
  ) { }

  ngOnInit(): void {
  }


  loadGame($event: any)
  {
    
  }
}
