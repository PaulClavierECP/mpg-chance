export type Goal = {
  goal: number;
  mpg: number;
  own_goal: number;
  cancel_goal: number;
  cancel_keeper_goal: number;
};
export type Player = {
  ownGoals: number;
  goals: number;
  name: string;
  position: number;
  rating: number;
};
export type Sub = {
  bonus: number;
  goals: Goal;
  id: string;
  name: string;
  number: number;
  position: number;
  rating: number;
  teamid: string;
};
export type PrePlayer = {
  bonus: number;
  goals: Goal;
  id: string;
  name: string;
  number: number;
  position: number;
  rating: number;
  substitute?: Sub;
  teamid: string;
};
export type Game = {
  homeName?: string;
  awayName?: string;
  home: PrePlayer[];
  away: PrePlayer[];
  day?: string;
};

export type Data = {
  bonus: { away: any; home: any };
  dateMatch: string;
  newTargetMan: string;
  oldTargetMan: string;
  players: { home: PrePlayer[]; away: PrePlayer[] };
  rating: 'equipe';
  stadium: 'Stade Bouteflika';
  teamAway: DataTeam;
  teamHome: DataTeam;
};

export type DataTeam = {
  abbr: string;
  badges: string[];
  coach: string;
  composition: string;
  id: string;
  jersey: DataJersey;
  jerseyUrl: string;
  mpguser: string;
  name: string;
  ranking: string;
  score: number;
  star: boolean;
  substitutes: DataSub[];
  userId: string;
};

export type DataJersey = {
  id: number;
  sponsor: number;
  zones: DataZone;
};

export type DataSub = {
  number: number;
  substituteName: string;
  starterName: string;
  rating: number;
};

export type DataZone = {
  z1: string;
};

export enum Location {
  'HOME',
  'AWAY',
}

export type signInReq = {
  email: string;
  password: string;
  language: string;
};

export type signInRes = {
  action: string;
  createdAt: string;
  language: string;
  onboarded: boolean;
  token: string;
  userId: string;
};

export type User = {
  firstname: string;
  lastname: string;
  id: string;
};
export type UserDto = {
  firstname: string;
  lastname: string;
};

export type Id = {
  email: string;
  password: string;
};

export type LeagueDto = {
  admin_mpg_user_id: string;
  championship: number; //1 for Ligue 1, 2 for UK league
  current_mpg_user: string;
  id: string;
  leagueStatus: number; //4: en cours, 5: depreciated
  mode: number; //1: normal, 2: expert
  name: string;
  players: number;
  teamStatus: number;
  url: string;
};

export type League = {
  id: string;
  name: string;
  players: number;
  leagueCountry: string;
  leagueStatus: string;
};

export const LeagueCountry = {
  '1': 'FRA',
  '2': 'UK',
  '3': 'ESP',
};

export const LeagueStatus = {
  '4': 'CURRENT',
  '5': 'TERMINATED',
};

export type Member = {
  name: string;
  id: string;
};
export type Ranking = {
  points: number;
  id: string;
};

export type MemberRanking = {
  name: string;
  id: string;
  points: number;
  expPoints?: number;
  rank?: number;
  expRank?: number;
};

export type Calendar = {};
