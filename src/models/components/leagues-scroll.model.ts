import { Tournament } from "../tournament.model";

export interface LeaguesScrollProps {
	tournaments: Tournament[];
	handleTournament: (tournament: Tournament) => void;
}