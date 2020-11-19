import { Injectable } from '@angular/core';
import { Player } from '../mpg-client/types';
import { MembersService } from '../mpg-client/members.service';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  constructor(private members: MembersService) {}

  public getPlayersOpposition(homeName: string, awayName: string, day: string) {
    const homeTeam = this.members.record[homeName].find(
      (elem) => elem.day === day
    );
    const awayTeam = this.members.record[awayName].find(
      (elem) => elem.day === day
    );
    return this.getResultFromTeams(homeTeam.lineup, awayTeam.lineup);
  }

  public getResultFromTeams(
    homePlayers: Player[],
    awayPlayers: Player[]
  ): { home: number; away: number } {
    const homeRegularGoals = homePlayers
      .map((player) => player.goals)
      .reduce((a, b) => a + b, 0);
    const awayRegularGoals = awayPlayers
      .map((player) => player.goals)
      .reduce((a, b) => a + b, 0);

    const homeMpgGoals = homePlayers
      .map((player) => this.playerMpgGoal(player, awayPlayers, true))
      .reduce((a, b) => a + b, 0);
    const awayMpgGoals = awayPlayers
      .map((player) => this.playerMpgGoal(player, homePlayers, false))
      .reduce((a, b) => a + b, 0);

    const homeKeeper = homePlayers.find((player) => player.position === 1) ?? {
      position: 1,
      rating: 2.5,
      name: 'Rotaldo',
      goals: 0,
      ownGoals: 0,
    };
    const awayGetsDeniedbyKeeper = this.keeperStopsGoal(homeKeeper);
    const awayKeeper = awayPlayers.find((player) => player.position === 1) ?? {
      position: 1,
      rating: 2.5,
      name: 'Rotaldo',
      goals: 0,
      ownGoals: 0,
    };
    const homeGetsDeniedbyKeeper = this.keeperStopsGoal(awayKeeper);

    const homeOwnGoals = homePlayers
      .map((player) => player.ownGoals)
      .reduce((a, b) => a + b, 0);
    const awayOwnGoals = awayPlayers
      .map((player) => player.ownGoals)
      .reduce((a, b) => a + b, 0);

    return {
      home:
        homeRegularGoals + homeMpgGoals - homeGetsDeniedbyKeeper + awayOwnGoals,

      away:
        awayRegularGoals + awayMpgGoals - awayGetsDeniedbyKeeper + homeOwnGoals,
    };
  }

  private playerMpgGoal(
    player: Player,
    opponent: Player[],
    isPlayerHome: boolean
  ): number {
    // Already scored: can't twice
    if (player.goals > 0) {
      return 0;
    }
    // Keeper does not score
    if (player.position === 1) {
      return 0;
    }

    //Can't score below 5
    if (player.rating < 5) {
      return 0;
    }

    if (player.position === 4) {
      if (
        this.passLogicPosition(player.rating, opponent, isPlayerHome, 2) &&
        this.passLogicPosition(player.rating - 1, opponent, isPlayerHome, 1)
      ) {
        return 1;
      }
    }

    if (player.position === 3) {
      if (
        this.passLogicPosition(player.rating, opponent, isPlayerHome, 3) &&
        this.passLogicPosition(player.rating - 1, opponent, isPlayerHome, 2) &&
        this.passLogicPosition(player.rating - 1.5, opponent, isPlayerHome, 1)
      ) {
        return 1;
      }
    }

    if (player.position === 2) {
      if (
        this.passLogicPosition(player.rating, opponent, isPlayerHome, 4) &&
        this.passLogicPosition(player.rating - 1, opponent, isPlayerHome, 3) &&
        this.passLogicPosition(
          player.rating - 1.5,
          opponent,
          isPlayerHome,
          2
        ) &&
        this.passLogicPosition(player.rating - 2, opponent, isPlayerHome, 1)
      ) {
        return 1;
      }
    }

    return 0;
  }

  private keeperStopsGoal(player: Player): number {
    if (player.position > 1) {
      return 0;
    }
    if (player.rating < 8) {
      return 0;
    }
    return 1;
  }

  private rotaldoGoal(team: Player[]): number {
    const rotaldos = team.filter((player) => {
      return player.name === 'Rotaldo';
    });

    if (rotaldos.length < 3) {
      return 0;
    }

    return rotaldos.length - 2;
  }

  private passLogicPosition(
    rating: number,
    opponent: Player[],
    isPlayerHome: boolean,
    position: number
  ) {
    if (isPlayerHome) {
      if (rating < this.getOppositionAverageLineRating(opponent, position)) {
        return false;
      }
      return true;
    } else {
      if (rating <= this.getOppositionAverageLineRating(opponent, position)) {
        return false;
      }
      return true;
    }
  }

  private getOppositionAverageLineRating(opponent: Player[], position: number) {
    const line = opponent.filter((oppPlayer) => {
      return oppPlayer.position === position;
    });
    const sum = line
      .map((oppPlayer) => oppPlayer.rating)
      .reduce((a, b) => a + b, 0);

    const avg = sum / line.length;
    return avg;
  }
}
