import { FC, useContext, useEffect, useState } from 'react';

import { Stack, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { AppContext } from '../../../context/app.context';
import { Team } from '../../../models/team.model';
import { deleteTeamItem, getTeamsItems } from '../../../services/teams.service';
import SpinnerComponent from '../../commons/spinner/spinner.component';
import ViewerComponent from '../../commons/viewer/viewer.component';
import TableComponent from '../../commons/table/table.component';

const TABLE_HEADERS_TEAMS = [
	{
		label: 'Logo',
		value: 'img',
		type: 'image',
	},
	{
		label: 'Name',
		value: 'country',
		type: 'text',
	},
];

const ListTeamsComponent: FC = (): JSX.Element => {
	const history = useHistory();
	const { fetchTeams, teams, deleteTeam } = useContext(AppContext);
	const { enqueueSnackbar } = useSnackbar();
	const [displayTeams, setDisplayTeams] = useState<Team[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const retrieveTeams = async () => {
			if (teams.length) {
				setDisplayTeams(teams);
				setLoading(false);
				return;
			}
			const teamsResponse = await getTeamsItems();
			if (teamsResponse) {
				fetchTeams(teamsResponse);
				setDisplayTeams(teamsResponse);
				setLoading(false);
			}
		};
		retrieveTeams();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const redirectTo = (path: string) => {
		history.push(path);
	};

	const handleDelete = async (team: Team) => {
		const deletedItem = await deleteTeamItem(team.id as string);
		if (deletedItem) {
			deleteTeam(team.id as string);
			const newTeams = displayTeams.filter(
				(teamItem: Team) => teamItem.id !== team.id
			);
			setDisplayTeams(newTeams);
			enqueueSnackbar(`${team.country} deleted`, {
				variant: 'warning',
				resumeHideDuration: 5000,
				anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
			});
		} else {
			enqueueSnackbar(`${team.country} was not deleted, try again later`, {
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
					<Button variant="outlined" onClick={() => redirectTo('/teams/item')}>
						Add Team
					</Button>
				</Stack>
				<TableComponent
					headers={TABLE_HEADERS_TEAMS}
					data={displayTeams}
					actions={true}
					searchField="country"
					sortByField="country"
					handleDelete={handleDelete}
					handleEdit={(team) =>
						redirectTo(`/teams/item?mode=edit&teamId=${team.id}`)
					}
				/>
			</Stack>
		</ViewerComponent>
	);
};

export default ListTeamsComponent;
