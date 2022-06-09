import { IMatch } from "../models/match.model"

export const matchTitleUtil = (match: IMatch, isMobile = false): string => {
  return isMobile ? 
    `${match.home?.country} vs ${match.away?.country}` : 
    `${match.home?.country} vs ${match.away?.country} | ${match.title} | ${match.tournament?.name} | ${match.tournament?.season}`
}