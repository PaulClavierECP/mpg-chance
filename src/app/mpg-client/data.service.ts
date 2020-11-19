import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { makeArray } from '../utils/array';
import { Observable, forkJoin, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Player, PrePlayer, Game, Data } from './types';
import { MembersService } from './members.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient, private members: MembersService) {}

  isReady$: Subject<boolean> = new Subject();
  get isReady() {
    return this.isReady$.asObservable();
  }

  public getLeagueData(token: string) {
    const games = makeArray(this.members.members.length / 2);
    const days = makeArray(this.members.currentDay);

    const observables: Observable<Game>[] = [];

    days.forEach((day) => {
      games.forEach((game) => {
        observables.push(this.getGameData(String(day), String(game), token));
      });
    });

    const queries = forkJoin(observables);
    queries.subscribe({
      next: (games) => {
        games.forEach((game) => this.hydrateMembersRecord(game));
      },
      complete: () => this.isReady$.next(true),
    });
  }

  // public getLeagueData(token: string) {
  //   const games = makeArray(this.members.members.length / 2);
  //   const days = makeArray(this.members.currentDay);

  //   days.forEach((day) => {
  //     games.forEach((game) => {
  //       this.hydrateMembersRecords(String(day), String(game), token);
  //     });
  //   });

  //   return of('');
  // }

  public getGameData(
    day: string,
    game: string,
    token: string
  ): Observable<Game> {
    return this.getRawGameData(day, game, token).pipe(
      map((res) => {
        const players = res.data.players;
        const homeName = res.data.teamHome.name;
        const awayName = res.data.teamAway.name;

        return {
          home: players.home,
          away: players.away,
          homeName,
          awayName,
          day,
        };
      })
    );
  }

  private getRawGameData(
    day: string,
    game: string,
    token: string
  ): Observable<{ data: Data }> {
    const options = {
      headers: {
        Authorization: token,
      },
    };

    return this.http.get<any>(
      `https://api.monpetitgazon.com/league/${this.members.currentLeagueId}/results/${this.members.currentSeason}_${day}_${game}`,
      options
    );
  }

  private getPlayer(player: PrePlayer): Player {
    return {
      goals:
        player.goals.goal +
        player.goals.cancel_goal +
        player.goals.cancel_keeper_goal,
      ownGoals: player.goals.own_goal,
      name: player.name,
      position: player.position,
      rating: player.rating + player.bonus,
    };
  }

  // TODO
  public hydrateMembersRecord(game: Game) {
    const playerHome: string = game.homeName;
    const playerAway: string = game.awayName;
    const day: string = game.day;
    this.members.record[playerHome].push({
      day,
      lineup: this.getHomeLineUp(game),
    });
    this.members.record[playerAway].push({
      day,
      lineup: this.getAwayLineUp(game),
    });
  }

  // public hydrateMembersRecords(day: string, game: string, token: string) {
  //   this.getGameData(day, game, token).subscribe((gameData) => {
  //     const playerHome: string = gameData.homeName;
  //     const playerAway: string = gameData.awayName;
  //     this.members.record[playerHome].push({
  //       day,
  //       lineup: this.getHomeLineUp(gameData),
  //     });
  //     this.members.record[playerAway].push({
  //       day,
  //       lineup: this.getAwayLineUp(gameData),
  //     });
  //   });
  // }

  public getHomeLineUp(game: Game): Player[] {
    return game.home.map((player) => {
      if (player.substitute) {
        const sub = player.substitute;
        sub.position = player.position;
        return this.getPlayer(sub);
      }

      return this.getPlayer(player);
    });
  }

  public getAwayLineUp(game: Game): Player[] {
    return game.away.map((player) => {
      if (player.substitute) {
        const sub = player.substitute;
        sub.position = player.position;
        return this.getPlayer(sub);
      }

      return this.getPlayer(player);
    });
  }
}
