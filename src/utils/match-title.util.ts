import { IMatch } from "../models/match.model"

export const matchTitleUtil = (match: IMatch, isMobile = false): string => {
  return `${match.home?.country} vs ${match.away?.country} ${isMobile ? '' : `| ${match.title} | ${match.tournament?.name} ${match.tournament?.season}`}`
}