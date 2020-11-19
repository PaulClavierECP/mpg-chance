import { Injectable } from '@angular/core';

import { generateSchedule } from 'sports-schedule-generator';
import Match from 'sports-schedule-generator/lib/match';
import { MatchService } from './match.service';
import { MembersService } from '../mpg-client/members.service';

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

type Calendar = Match<string>[][];

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor(private match: MatchService, private members: MembersService) {}

  public createCalendar(members: string[]) {
    const firstPhase: Match<string>[][] = generateSchedule(shuffle(members));
    const secondPhase = firstPhase.map((day) =>
      day.map((game) => {
        return { home: game.away, away: game.home };
      })
    );

    const calendar = firstPhase.concat(secondPhase);
    return calendar.slice(0, this.members.currentDay);
  }

  public calculateSeasonPoints(calendar: Calendar): Record<string, number> {
    let seasonRecord: Record<string, number> = {};
    this.members.members.forEach((member) => (seasonRecord[member.name] = 0));

    calendar.forEach((day, index) => {
      day.forEach((game) => {
        const results = this.match.getPlayersOpposition(
          game.home,
          game.away,
          String(index + 1)
        );

        seasonRecord = this.assignGamePoints(
          game.home,
          game.away,
          results.home,
          results.away,
          seasonRecord
        );
      });
    });

    return seasonRecord;
  }

  private assignGamePoints(
    homeName: string,
    awayName: string,
    homeScore: number,
    awayScore: number,
    currentRecord: Record<string, number>
  ) {
    if (homeScore > awayScore) {
      currentRecord[homeName] += 3;
    }
    if (awayScore > homeScore) {
      currentRecord[awayName] += 3;
    }
    if (awayScore === homeScore) {
      currentRecord[homeName] += 1;
      currentRecord[awayName] += 1;
    }

    return currentRecord;
  }
}
