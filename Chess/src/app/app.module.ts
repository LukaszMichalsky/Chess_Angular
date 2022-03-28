import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './main/game.component';
import { MenuComponent } from './menu/menu.component';
import { ChallengeComponent } from './challenge/challenge.component';
import { LoadComponent } from './save&load/load/load.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule} from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field';
import { SaveComponent } from './save&load/save/save/save.component';


@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    MenuComponent,
    ChallengeComponent,
    LoadComponent,
    SaveComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
