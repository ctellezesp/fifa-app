import { FC } from 'react';

import { Paper, Grid, Typography, Stack } from '@mui/material';
import { fromUnixTime, format } from 'date-fns';

import { IMatch } from '../../../models/match.model';
import TeamInfoComponent from './team-info.component';
import { Team } from '../../../models/team.model';

interface MatchCardProps {
	match: IMatch;
	handleClick: (match: IMatch) => void;
}

const MatchCardComponent: FC<MatchCardProps> = ({
	match,
	handleClick,
}): JSX.Element => {
	const matchDate: Date = fromUnixTime(match.date);

	return (
		<Paper
			elevation={2}
			sx={{ padding: '10px', cursor: 'pointer' }}
			onClick={() => handleClick(match)}
		>
			<Grid container spacing={1}>
				<Grid item xs={12}>
					<Typography variant="body2">{match.title}</Typography>
				</Grid>
				<Grid item xs={8}>
					<Stack spacing={1}>
						<TeamInfoComponent team={match.home as Team} />
						<TeamInfoComponent team={match.away as Team} />
					</Stack>
				</Grid>
				<Grid item xs={4}>
					<Stack
						direction="column"
						justifyContent="center"
						alignItems="flex-end"
						spacing={1}
						sx={{ padding: '10px' }}
					>
						<Typography variant="body1" align="right">
							{format(matchDate, 'dd/MMM/yy')}
						</Typography>
						<Typography variant="body1" align="right">
							{format(matchDate, 'H:mm')}
						</Typography>
					</Stack>
				</Grid>
			</Grid>
		</Paper>
	);
};

export default MatchCardComponent;
