import { Component, Input, OnInit } from '@angular/core';
import { League, MemberRanking } from '../../../mpg-client/types';
import { UserService } from '../../../mpg-client/user.service';
import { MembersService } from '../../../mpg-client/members.service';
import { SimulService } from '../../../simulation/simul.service';
import { forkJoin, of } from 'rxjs';
import { DataService } from '../../../mpg-client/data.service';
import { TRAINING } from '../../../simulation/train';
import { tap } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-leagues-form',
  templateUrl: './leagues-form.component.html',
  styleUrls: ['./leagues-form.component.scss'],
})
export class LeaguesFormComponent implements OnInit {
  constructor(
    private user: UserService,
    private member: MembersService,
    private data: DataService,
    private simul: SimulService,
    private fb: FormBuilder
  ) {}

  @Input() leagues: League;

  form = this.fb.group({
    league: ['', Validators.required],
  });

  get league(): string {
    return this.form.get('league').value;
  }

  ngOnInit() {
    this.form
      .get('league')
      .valueChanges.subscribe(() => (this.isReadyForSimul = false));
  }

  isLoading = false;
  isReadyForSimul = false;
  isReadyForData = false;

  onSubmit() {
    // Reset the record
    this.member.record = {};

    const token$ = this.user.token;
    token$.subscribe((token) => {
      forkJoin({
        members: this.user.getMembersFromTokenAndLeague(token, this.league),
        currentDay: this.user.getCurrentDayFromTokenAndLeague(
          token,
          this.league
        ),
        currentSeason: this.user.getCurrentSeasonFromTokenAndLeague(
          token,
          this.league
        ),
        token: of(token),
      })
        .pipe(
          tap(({ members, currentDay, currentSeason }) => {
            this.isLoading = true;
            this.member.members = members;
            this.member.currentDay = currentDay;
            this.member.currentSeason = currentSeason;
            this.member.currentLeagueId = this.league;

            members.forEach((member) => (this.member.record[member.name] = []));

            this.isLoading = false;
          })
        )
        .subscribe(({ token }) => {
          this.data.getLeagueData(token);

          this.data.isReady$.subscribe(() => {
            this.isLoading = false;
            this.isReadyForSimul = true;
          });
        });
    });
  }

  onSimul() {
    this.isLoading = true;
    this.simul.initSimul();
    const simuleTable = this.simul.runSimul();
    const results: MemberRanking[] = [];
    this.isLoading = false;

    Object.entries(simuleTable).forEach(([memberSimul, simuls]) => {
      const curMember = this.member.members.find(
        (member) => member.name === memberSimul
      );
      curMember.expPoints = parseFloat(
        (simuls.reduce((a, b) => a + b, 0) / TRAINING).toFixed(1)
      );
      results.push(curMember);
    });

    this.member.membersSimul$.next(results);
  }
}
