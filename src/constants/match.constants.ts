import { IMatch } from "../models/match.model";

export const FAKE_MATCH: IMatch = {
  title: '',
  date: new Date().getTime(),
  tournamentId: '',
  homeId: '',
  awayId: '',
  stadium: '',
  streams: [],
}