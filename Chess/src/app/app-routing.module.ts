import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChallengeComponent } from './challenge/challenge.component';
import { GameComponent } from './main/game.component';
import { MenuComponent } from './menu/menu.component';
import { LoadComponent } from './save&load/load/load.component';

const routes: Routes = [
  {
    path: '', component: MenuComponent
  },
  {
    path: 'game', component: GameComponent
  },
  {
    path: 'challenge', component: ChallengeComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
