import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SimulationModule } from './simulation/simulation.module';
import { MpgModule } from './mpg-client/mpg.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoginFormModule } from './pages/login-form/login-form.module';
import { UserComponent } from './pages/user/user.component';
import { LeaguesComponent } from './pages/leagues/leagues.component';
import { LeaguesModule } from './pages/leagues/leagues.module';
import { EmojiCountryComponent } from './utils/emoji-country/emoji-country.component';
import { TableModule } from './pages/table/table.module';
// import { LoginService } from './mpg-client/login.service';
// import { DataService } from './mpg-client/data.service';

@NgModule({
  declarations: [AppComponent, UserComponent, EmojiCountryComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SimulationModule,
    MpgModule,
    LoginFormModule,
    BrowserAnimationsModule,
    LeaguesModule,
    TableModule,
  ],
  // providers: [LoginService, DataService],
  bootstrap: [AppComponent],
})
export class AppModule {}
