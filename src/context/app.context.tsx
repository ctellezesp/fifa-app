import { createContext, useState, FC } from 'react';
import { FAKE_TOURNAMENT } from '../constants/tournaments.constants';
import { ComponentType } from '../models/component.model';
import { Tournament } from '../models/tournament.model';

interface IAppContext {
	tournaments: Tournament[];
	fetchTournaments: (tournaments: Tournament[]) => void;
	addTournament: (tournament: Tournament) => void;
	editTournament: (tournamentId: string, tournament: Tournament) => void;
	getTournament: (tournamentId: string) => Tournament | undefined;
	deleteTournament: (tournamentId: string) => void;
}

interface IAppContextState {
	tournaments: Tournament[];
}

export const AppContext = createContext<IAppContext>({
	tournaments: [],
	fetchTournaments: (tournaments: Tournament[]) => null,
	addTournament: (tournament: Tournament) => null,
	editTournament: (tournamentId: string, tournament: Tournament) => null,
	getTournament: (tournamentId: string) => FAKE_TOURNAMENT,
	deleteTournament: (tournamentId: string) => null,
});

export const AppContextProvider: FC<ComponentType> = ({ children }) => {
	const [state, setState] = useState<IAppContextState>({
		tournaments: [],
	});

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

	const { tournaments } = state;

	return (
		<AppContext.Provider
			value={{
				tournaments,
				fetchTournaments,
				addTournament,
				editTournament,
				getTournament,
				deleteTournament,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
