import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Chess';

  getRoute(){
    return this.router.url;
  }
  
  constructor(private router: Router)
  {}
}
