import { Component } from '@angular/core';
import { UserService } from './mpg-client/user.service';
import { MembersService } from './mpg-client/members.service';
import Match from 'sports-schedule-generator/lib/match';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'mpg-chance';
  gamesPlayed: number;
  calendarSim: Match<string>[][];
  isLogin = false;
  isTable = false;

  constructor(private user: UserService, public members: MembersService) {}

  user$ = this.user.user.pipe(tap(() => (this.isLogin = true)));
  leagues$ = this.user.leagues$;
  table$ = this.members.table.pipe(
    tap(() => (this.isTable = true)),
    map((table) => {
      const points =
        table.map((member) => member.points).sort((a, b) => b - a) ?? [];
      const expPoints =
        table.map((member) => member.expPoints).sort((a, b) => b - a) ?? [];

      table.map((member) => {
        member.rank = points.indexOf(member.points) + 1;
        member.expRank = expPoints.indexOf(member.expPoints) + 1;
      });

      return table;
    })
  );

  // onMembers() {
  //   this.signIn$.subscribe((signIn) => {
  //     this.members.formatMembers(signIn.token);
  //   });
  //   console.log(this.members.members);
  // }

  // onLeagueData() {
  //   this.signIn$.subscribe((signIn) => {
  //     this.data.token = signIn.token;
  //     this.data.getLeagueData().subscribe(() => {
  //       this.calendarSim = this.calendar.createCalendar(this.members.members);
  //       console.log(this.members.record);
  //     });
  //   });
  // }

  // onSimulation() {
  //   this.points.initSimul();
  //   const simuleTable = this.points.runSimul();
  //   Object.entries(simuleTable).forEach(([member, simuls]) => {
  //     console.log(member, simuls.reduce((a, b) => a + b, 0) / TRAINING);
  //   });
  // }

  // onLogData() {
  //   console.log(this.members.record);
  // }
}
