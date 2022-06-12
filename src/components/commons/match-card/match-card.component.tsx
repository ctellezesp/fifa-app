import { FC } from 'react';

import { Paper, Grid, Typography, Avatar, Stack } from '@mui/material';
import { fromUnixTime, format } from 'date-fns';

import { IMatch } from '../../../models/match.model';

interface MatchCardProps {
	match: IMatch;
	handleClick: (match: IMatch) => void;
}

const MatchCardComponent: FC<MatchCardProps> = ({
	match,
	handleClick,
}): JSX.Element => {
	const FALLBACK_LOGO =
		'https://ruizhealytimes.com/wp-content/uploads/2015/05/fifa.png';

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
				<Grid item xs={7}>
					<Stack spacing={1}>
						<Stack
							direction="row"
							justifyContent="flex-start"
							alignItems="center"
							spacing={1}
						>
							<Avatar
								src={match.home?.img || match.home?.shield_url || FALLBACK_LOGO}
								alt={match.home?.country}
							/>
							<Typography variant="body1">{match.home?.country}</Typography>
						</Stack>
						<Stack
							direction="row"
							justifyContent="flex-start"
							alignItems="center"
							spacing={1}
						>
							<Avatar
								src={match.away?.img || match.away?.shield_url || FALLBACK_LOGO}
								alt={match.away?.country}
							/>
							<Typography variant="body1">{match.away?.country}</Typography>
						</Stack>
					</Stack>
				</Grid>
				<Grid item xs={5}>
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
							{format(matchDate, 'h:mm a')}
						</Typography>
					</Stack>
				</Grid>
				{/* <Grid item xs={12}>
					<Typography variant="body1" align="center">
						{match.stadium}
					</Typography>
				</Grid> */}
			</Grid>
		</Paper>
	);
};

export default MatchCardComponent;
