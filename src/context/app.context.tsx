import { createContext, useState, FC } from 'react';
import { FAKE_TOURNAMENT } from '../constants/tournaments.constants';
import { ComponentType } from '../models/component.model';
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
}

interface IAppContextState {
	tournaments: Tournament[];
	teams: Team[];
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
});

export const AppContextProvider: FC<ComponentType> = ({ children }) => {
	const [state, setState] = useState<IAppContextState>({
		tournaments: [],
		teams: [],
	});

	const [mapTeams, setMapTeams] = useState<Map<string, Team>>(new Map());

	// TOURNAMENTS

	const fetchTournaments = (tournaments: Tournament[]): void => {
		setState((prevState) => ({
			...prevState,
			tournaments,
		}));
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
		return state.tournaments.find(
			(tournamentItem: Tournament) => tournamentItem.id === tournamentId
		);
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

	const { tournaments, teams } = state;

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
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
