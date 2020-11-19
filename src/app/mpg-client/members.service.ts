import { Injectable } from '@angular/core';
import { Player, MemberRanking } from './types';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  members: MemberRanking[];
  membersSimul$: Subject<MemberRanking[]> = new Subject();

  get table() {
    return this.membersSimul$.asObservable();
  }

  record: Record<string, { day: string; lineup: Player[] }[]> = {};

  currentLeagueId: string;
  currentDay: number;
  currentSeason: string;
}
