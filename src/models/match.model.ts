import { Team } from "./team.model";
import { Tournament } from "./tournament.model";

export interface MatchStream {
  label: string;
  frame: string;
}

export interface IMatch {
  id?: string;
  title: string;
  date: number;
  tournament?: Tournament;
  tournamentId: string;
  home?: Team;
  away?: Team;
  homeId: string;
  awayId: string;
  stadium: string;
  streams: MatchStream[];
}