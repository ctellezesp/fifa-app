import { FC } from 'react';

import { Stack, Paper, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { sortBy } from 'lodash';

import ViewerComponent from '../commons/viewer/viewer.component';

interface DashboardItem {
	label: string;
	route: string;
}

const DashboardComponent: FC = (): JSX.Element => {
	const history = useHistory();

	const routes: DashboardItem[] = [
		{
			label: 'Matches',
			route: '/matches',
		},
		{
			label: 'Tournaments',
			route: '/tournaments',
		},
		{
			label: 'Teams',
			route: '/teams',
		},
	];

	return (
		<ViewerComponent>
			<Stack spacing={2} justifyContent="center">
				{sortBy(routes, 'label').map((route: DashboardItem) => (
					<Paper
						key={route.route}
						sx={{ padding: '10px', cursor: 'pointer' }}
						onClick={() => history.push(route.route)}
					>
						<Typography variant="h5" align="center">
							{route.label}
						</Typography>
					</Paper>
				))}
			</Stack>
		</ViewerComponent>
	);
};

export default DashboardComponent;
