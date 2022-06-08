import { FC, useContext, useEffect, useState } from 'react';

import { Stack, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';

import { Tournament } from '../../../models/tournament.model';
import ViewerComponent from '../../commons/viewer/viewer.component';
import TableComponent from '../../commons/table/table.component';
import { AppContext } from '../../../context/app.context';
import {
	deleteTournamentItem,
	getTournamentsItems,
} from '../../../services/tournaments.service';
import SpinnerComponent from '../../commons/spinner/spinner.component';
import { useSnackbar } from 'notistack';

const TABLE_HEADERS_TOURNAMETS = [
	{
		label: 'Logo',
		value: 'image',
		type: 'image',
	},
	{
		label: 'Name',
		value: 'name',
		type: 'text',
	},
	{
		label: 'Edition',
		value: 'season',
		type: 'text',
	},
];

const ListTournamentsComponent: FC = (): JSX.Element => {
	const history = useHistory();
	const { fetchTournaments, deleteTournament, tournaments } =
		useContext(AppContext);

	const { enqueueSnackbar } = useSnackbar();

	const [tournamentsDisplay, setTournaments] = useState<Tournament[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const getTournaments = async () => {
			if (tournaments.length) {
				setTournaments(tournaments);
				setLoading(false);
				return;
			}
			const tournamentsResponse = await getTournamentsItems();
			if (tournamentsResponse) {
				fetchTournaments(tournamentsResponse as Tournament[]);
				setTournaments(tournamentsResponse as Tournament[]);
				setLoading(false);
			}
		};
		getTournaments();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const redirectTo = (path: string) => {
		history.push(path);
	};

	const handleDelete = async (tournament: Tournament) => {
		const deletedItem = await deleteTournamentItem(tournament.id as string);
		console.log({
			deletedItem,
		});
		if (deletedItem) {
			deleteTournament(tournament.id as string);
			const newTournaments = tournamentsDisplay.filter(
				(tournamentItem: Tournament) => tournamentItem.id !== tournament.id
			);
			console.log({
				newTournaments,
			});
			setTournaments(newTournaments);
			enqueueSnackbar(`${tournament.name} deleted`, {
				variant: 'warning',
				resumeHideDuration: 5000,
				anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
			});
		} else {
			enqueueSnackbar(`${tournament.name} was not deleted, try again later`, {
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
						onClick={() => redirectTo('/tournaments/item')}
					>
						Add Tournament
					</Button>
				</Stack>
				<TableComponent
					headers={TABLE_HEADERS_TOURNAMETS}
					data={tournamentsDisplay}
					actions={true}
					searchField="name"
					sortByField="season"
					handleDelete={handleDelete}
					handleEdit={(tournament) =>
						redirectTo(
							`/tournaments/item?mode=edit&tournamentId=${tournament.id}`
						)
					}
				/>
			</Stack>
		</ViewerComponent>
	);
};

export default ListTournamentsComponent;
