import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, map, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import {
  User,
  signInReq,
  signInRes,
  League,
  LeagueDto,
  LeagueStatus,
  LeagueCountry,
  Member,
  Ranking,
  MemberRanking,
} from './types';

const LANGUAGE = 'fr-FR';
const HOST = 'https://api.monpetitgazon.com';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  //User
  email: string;
  password: string;

  token$: Observable<string>;

  user$: Subject<User> = new Subject();
  leagues$: Subject<League[]> = new Subject();

  currentSeasonDay: Subject<number> = new Subject();
  currentSeason: Subject<number> = new Subject();

  get user() {
    return this.user$.asObservable();
  }

  get token() {
    if (!this.token$) {
      this.token$ = this.generateToken().pipe(shareReplay(1));
    }

    return this.token$;
  }

  generateToken(): Observable<string> {
    const USER_EMAIL = this.email;
    const USER_PASSWORD = this.password;

    const signInBody: signInReq = {
      email: USER_EMAIL,
      password: USER_PASSWORD,
      language: LANGUAGE,
    };

    return this.http
      .post<signInRes>(`${HOST}/user/signIn`, signInBody)
      .pipe(map((signInRes) => signInRes.token));
  }

  getUserInfoFromToken(token: string): Observable<User> {
    const options = this.formatOptions(token);

    return this.http.get<any>(`${HOST}/user`, options).pipe(
      map((userDto) => ({
        firstname: userDto.firstname,
        lastname: userDto.lastname,
        id: userDto.id,
      })),
      shareReplay(1)
    );
  }

  getLeagueInfoFromToken(token: string): Observable<League[]> {
    const options = this.formatOptions(token);

    return this.http.get<any>(`${HOST}/user/dashboard`, options).pipe(
      map((dto) => {
        return dto.data.leagues.map((leagueDto: LeagueDto) => {
          return {
            name: leagueDto.name,
            id: leagueDto.id,
            players: leagueDto.players,
            leagueCountry: LeagueCountry[String(leagueDto.championship)],
            leagueStatus: LeagueStatus[String(leagueDto.leagueStatus)],
          };
        });
      })
    );
  }

  getMembersFromTokenAndLeague(
    token: string,
    leagueId: string
  ): Observable<MemberRanking[]> {
    const options = this.formatOptions(token);
    const LEAGUE_ID = leagueId;

    return this.http
      .get<any>(`${HOST}/league/${LEAGUE_ID}/ranking`, options)
      .pipe(
        map((data) => {
          const rankings: Ranking[] = data.ranking.map((ranking) => {
            return {
              points: ranking.points,
              id: this.formatIdFromTeamId(ranking.teamid),
            };
          });
          const members: Member[] = Object.values(data.teams).map(
            (member: any) => {
              return { name: member.name, id: member.userId };
            }
          );
          return this.mergeRankingsandMembers(rankings, members);
        })
      );
  }

  getCurrentDayFromTokenAndLeague(
    token: string,
    leagueId: string
  ): Observable<number> {
    const options = this.formatOptions(token);
    const LEAGUE_ID = leagueId;

    return this.http
      .get<any>(`${HOST}/league/${LEAGUE_ID}/calendar`, options)
      .pipe(map((res) => res.data.results.currentMatchDay));
  }

  getCurrentSeasonFromTokenAndLeague(
    token: string,
    leagueId: string
  ): Observable<string> {
    const options = this.formatOptions(token);
    const LEAGUE_ID = leagueId;

    return this.http
      .get<any>(`${HOST}/league/${LEAGUE_ID}/calendar`, options)
      .pipe(
        map((res) => {
          return this.formatSeasonFromMatch(res.data.results.matches[0]);
        })
      );
  }

  formatOptions(token: string) {
    return {
      headers: {
        Authorization: token,
      },
    };
  }

  formatIdFromTeamId(teamId: string): string {
    return teamId.split('$$')[1];
  }

  formatSeasonFromMatch(match: any): string {
    return match.id.split('_')[0];
  }

  mergeRankingsandMembers(
    rankings: Ranking[],
    members: Member[]
  ): MemberRanking[] {
    return rankings.map((ranking) => {
      const member = members.find((member) => member.id === ranking.id);
      return { name: member.name, id: ranking.id, points: ranking.points };
    });
  }
}
