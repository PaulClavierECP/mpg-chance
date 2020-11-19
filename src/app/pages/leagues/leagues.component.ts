import { Component, Input } from '@angular/core';
import { League } from '../../mpg-client/types';

@Component({
  selector: 'app-leagues',
  templateUrl: './leagues.component.html',
  styleUrls: ['./leagues.component.scss'],
})
export class LeaguesComponent {
  @Input() leagues: League[] = [];
  leaguesActive: League[];
  leaguesInactive: League[];

  ngOnChanges() {
    this.leaguesActive = this.leagues?.filter(
      (league) => league.leagueStatus == 'CURRENT'
    );
    this.leaguesInactive = this.leagues?.filter(
      (league) => league.leagueStatus == 'TERMINATED'
    );
  }
}
