import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogicService } from 'src/app/service/logic.service';

@Component({
  selector: 'load-component',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.css']
})
export class LoadComponent implements OnInit {

  constructor(
    private logicService: LogicService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }


  loadGame($event: any)
  {
    this.logicService.isNewGame = false;
    this.logicService.clearChessboard();
    this.router.navigate(['/game']);
  }
}
