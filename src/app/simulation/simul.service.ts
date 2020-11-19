import { Injectable } from '@angular/core';
import { TRAINING } from './train';
import { MembersService } from '../mpg-client/members.service';
import { makeArray } from '../utils/array';
import { CalendarService } from './calendar.service';

@Injectable({
  providedIn: 'root',
})
export class SimulService {
  constructor(
    private members: MembersService,
    private calendarService: CalendarService
  ) {}
  simulPoints: Record<string, number[]> = {};
  memberNames: string[];
  seasons: number[];

  initSimul() {
    this.simulPoints = {};
    this.members.members.forEach(
      (member) => (this.simulPoints[member.name] = [])
    );
    this.memberNames = this.members.members.map((member) => member.name);
    this.seasons = makeArray(TRAINING);
  }

  runSimul() {
    this.seasons.forEach((season) => {
      const calendar = this.calendarService.createCalendar(this.memberNames);
      const seasonRecord = this.calendarService.calculateSeasonPoints(calendar);
      if (season % 1000 === 0) console.log(season);
      Object.entries(seasonRecord).forEach(([member, points]) => {
        this.simulPoints[member].push(points);
      });
    });
    return this.simulPoints;
  }
}
