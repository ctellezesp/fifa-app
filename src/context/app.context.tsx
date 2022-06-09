import { createContext, useState, FC } from 'react';
import { FAKE_TOURNAMENT } from '../constants/tournaments.constants';
import { ComponentType } from '../models/component.model';
import { IMatch } from '../models/match.model';
import { Team } from '../models/team.model';
import { Tournament } from '../models/tournament.model';

interface IAppContext {
	tournaments: Tournament[];
	fetchTournaments: (tournaments: Tournament[]) => void;
	addTournament: (tournament: Tournament) => void;
	editTournament: (tournamentId: string, tournament: Tournament) => void;
	getTournament: (tournamentId: string) => Tournament | undefined;
	deleteTournament: (tournamentId: string) => void;
	teams: Team[];
	fetchTeams: (teams: Team[]) => void;
	addTeam: (team: Team) => void;
	editTeam: (teamId: string, team: Team) => void;
	getTeam: (teamId: string) => Team | undefined;
	deleteTeam: (teamId: string) => void;
	matches: IMatch[];
	fetchMatches: (matches: IMatch[]) => void;
	addMatch: (match: IMatch) => void;
	editMatch: (matchId: string, match: IMatch) => void;
	getMatch: (matchId: string) => IMatch | undefined;
	deleteMatch: (matchId: string) => void;
}

interface IAppContextState {
	tournaments: Tournament[];
	teams: Team[];
	matches: IMatch[];
}

export const AppContext = createContext<IAppContext>({
	tournaments: [],
	fetchTournaments: (tournaments: Tournament[]) => null,
	addTournament: (tournament: Tournament) => null,
	editTournament: (tournamentId: string, tournament: Tournament) => null,
	getTournament: (tournamentId: string) => FAKE_TOURNAMENT,
	deleteTournament: (tournamentId: string) => null,
	teams: [],
	fetchTeams: (teams: Team[]) => null,
	addTeam: (team: Team) => null,
	editTeam: (teamId: string, team: Team) => null,
	getTeam: (teamId: string) => undefined,
	deleteTeam: (teamId: string) => null,
	matches: [],
	fetchMatches: (matches: IMatch[]) => null,
	addMatch: (match: IMatch) => null,
	editMatch: (matchId: string, match: IMatch) => null,
	getMatch: (matchId: string) => undefined,
	deleteMatch: (matchId: string) => null,
});

export const AppContextProvider: FC<ComponentType> = ({ children }) => {
	const [state, setState] = useState<IAppContextState>({
		tournaments: [],
		teams: [],
		matches: [],
	});

	const [mapTeams, setMapTeams] = useState<Map<string, Team>>(new Map());
	const [mapTournaments, setMapTournaments] = useState<Map<string, Tournament>>(
		new Map()
	);

	// TOURNAMENTS

	const fetchTournaments = (tournaments: Tournament[]): void => {
		setState((prevState) => ({
			...prevState,
			tournaments,
		}));
		const auxMap: Map<string, Tournament> = new Map();
		for (let tournamentItem of tournaments) {
			auxMap.set(tournamentItem.id as string, tournamentItem);
		}
		setMapTournaments(auxMap);
	};

	const addTournament = (tournament: Tournament): void => {
		setState((prevState) => ({
			...prevState,
			tournaments: [...prevState.tournaments, tournament],
		}));
	};

	const editTournament = (
		tournamentId: string,
		tournament: Tournament
	): void => {
		setState((prevState) => ({
			...prevState,
			tournaments: prevState.tournaments.map((tournamentItem: Tournament) =>
				tournamentItem.id === tournamentId ? tournament : tournamentItem
			),
		}));
	};

	const getTournament = (tournamentId: string): Tournament | undefined => {
		return mapTournaments.get(tournamentId);
	};

	const deleteTournament = (tournamentId: string): void => {
		setState((prevState) => ({
			...prevState,
			tournaments: prevState.tournaments.filter(
				(tournament: Tournament) => tournament.id !== tournamentId
			),
		}));
	};

	// TEAMS

	const fetchTeams = (teams: Team[]): void => {
		setState((prevState) => ({
			...prevState,
			teams,
		}));
		const auxMap: Map<string, Team> = new Map();
		for (let teamItem of teams) {
			auxMap.set(teamItem.id as string, teamItem);
		}
		setMapTeams(auxMap);
	};

	const addTeam = (team: Team): void => {
		setState((prevState) => ({
			...prevState,
			teams: [...prevState.teams, team],
		}));
	};

	const editTeam = (teamId: string, team: Team): void => {
		setState((prevState) => ({
			...prevState,
			teams: prevState.teams.map((teamItem: Team) =>
				teamItem.id === teamId ? team : teamItem
			),
		}));
	};

	const getTeam = (teamId: string): Team | undefined => {
		return mapTeams.get(teamId);
	};

	const deleteTeam = (teamId: string): void => {
		setState((prevState) => ({
			...prevState,
			teams: prevState.teams.filter((teamItem: Team) => teamItem.id !== teamId),
		}));
	};

	// MATCHES

	const completeMatch = (match: IMatch): IMatch => ({
		...match,
		home: getTeam(match.homeId),
		away: getTeam(match.awayId),
		tournament: getTournament(match.tournamentId),
	});

	const fetchMatches = (matches: IMatch[]): void => {
		setState((prevState) => ({
			...prevState,
			matches,
		}));
	};

	const addMatch = (match: IMatch): void => {
		setState((prevState) => ({
			...prevState,
			matches: [...prevState.matches, completeMatch(match)],
		}));
	};

	const editMatch = (matchId: string, match: IMatch): void => {
		setState((prevState) => ({
			...prevState,
			matches: prevState.matches.map((matchItem: IMatch) =>
				matchItem.id === matchId ? completeMatch(match) : matchItem
			),
		}));
	};

	const getMatch = (matchId: string): IMatch | undefined => {
		return state.matches.find((matchItem: IMatch) => matchItem.id === matchId);
	};

	const deleteMatch = (matchId: string): void => {
		setState((prevState) => ({
			...prevState,
			matches: prevState.matches.filter(
				(matchItem: IMatch) => matchItem.id !== matchId
			),
		}));
	};

	const { tournaments, teams, matches } = state;

	return (
		<AppContext.Provider
			value={{
				tournaments,
				fetchTournaments,
				addTournament,
				editTournament,
				getTournament,
				deleteTournament,
				teams,
				fetchTeams,
				addTeam,
				editTeam,
				getTeam,
				deleteTeam,
				matches,
				fetchMatches,
				addMatch,
				editMatch,
				getMatch,
				deleteMatch,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
