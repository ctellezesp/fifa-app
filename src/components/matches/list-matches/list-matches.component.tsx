import { FC, useContext, useEffect, useState } from 'react';

import { Stack, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { fromUnixTime, format } from 'date-fns';

import ViewerComponent from '../../commons/viewer/viewer.component';
import TableComponent from '../../commons/table/table.component';
import { AppContext } from '../../../context/app.context';
import SpinnerComponent from '../../commons/spinner/spinner.component';
import { useSnackbar } from 'notistack';
import { IMatch } from '../../../models/match.model';
import {
	deleteMatchItem,
	getMatchesItems,
} from '../../../services/matches.service';
import { Tournament } from '../../../models/tournament.model';
import LeaguesScrollComponent from '../../commons/leagues-scroll/leagues-scroll.component';
import { matchTitleUtil } from '../../../utils/match-title.util';

const TABLE_HEADERS_MATCHES = [
	{
		label: 'Title',
		value: 'full_title',
		type: 'text',
	},
	{
		label: 'Date',
		value: 'date_format',
		type: 'text',
	},
];

const ListMatchesComponent: FC = (): JSX.Element => {
	const history = useHistory();
	const {
		fetchMatches,
		deleteMatch,
		matches,
		fetchTournaments,
		fetchTeams,
		tournaments,
	} = useContext(AppContext);

	const { enqueueSnackbar } = useSnackbar();

	const [tournamentsDisplay, setTournamentsDisplay] =
		useState<Tournament[]>(tournaments);
	const [allMatches, setAllMatches] = useState<IMatch[]>([]);
	const [matchesDisplay, setMatchesDisplay] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const retrieveMatches = async () => {
			if (matches.length) {
				setAllMatches(matches);
				setLoading(false);
				return;
			}
			const matchesResponse = await getMatchesItems();
			if (matchesResponse) {
				const { matchesItems, tournaments, teams } = matchesResponse;
				setAllMatches(matchesItems);
				fetchMatches(matchesItems);
				fetchTournaments(tournaments);
				setTournamentsDisplay(tournaments);
				fetchTeams(teams);
				setLoading(false);
			}
		};
		retrieveMatches();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const formatingMatchesForTable = (matches: IMatch[]): any[] => {
		return matches.map((matchItem: IMatch) => ({
			...matchItem,
			full_title: matchTitleUtil(matchItem),
			date_format: format(fromUnixTime(matchItem.date), 'yyyy-MM-dd HH:mm'),
		}));
	};

	const handleLeague = (tournament: Tournament) => {
		filterMatchesByLeague(tournament, allMatches);
	};

	const filterMatchesByLeague = (
		tournament: Tournament,
		all_matches: IMatch[]
	) => {
		const filtered: IMatch[] = all_matches.filter(
			(matchItem: IMatch) => matchItem.tournamentId === tournament.id
		);
		const formatingMatches = formatingMatchesForTable(filtered);
		setMatchesDisplay(formatingMatches);
	};

	const redirectTo = (path: string) => {
		history.push(path);
	};

	const handleDelete = async (match: IMatch) => {
		const deletedItem = await deleteMatchItem(match.id as string);
		if (deletedItem) {
			deleteMatch(match.id as string);
			const newAllMatches = allMatches.filter(
				(matchItem: IMatch) => matchItem.id !== match.id
			);
			setAllMatches(newAllMatches);
			filterMatchesByLeague(match.tournament as Tournament, newAllMatches);
			enqueueSnackbar(`${match.title} deleted`, {
				variant: 'warning',
				resumeHideDuration: 5000,
				anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
			});
		} else {
			enqueueSnackbar(`${match.title} was not deleted, try again later`, {
				variant: 'error',
				resumeHideDuration: 5000,
				anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
			});
		}
	};

	return loading ? (
		<SpinnerComponent />
	) : (
		<ViewerComponent>
			<Stack spacing={2}>
				<Stack direction="row">
					<Button
						variant="outlined"
						onClick={() => redirectTo('/matches/item')}
					>
						Add Match
					</Button>
				</Stack>
				<LeaguesScrollComponent
					tournaments={tournamentsDisplay}
					handleTournament={handleLeague}
				/>
				<TableComponent
					headers={TABLE_HEADERS_MATCHES}
					data={matchesDisplay}
					actions={true}
					searchField="full_title"
					sortByField="date_format"
					handleDelete={handleDelete}
					handleEdit={(match) =>
						redirectTo(`/matches/item?mode=edit&matchId=${match.id}`)
					}
				/>
			</Stack>
		</ViewerComponent>
	);
};

export default ListMatchesComponent;
