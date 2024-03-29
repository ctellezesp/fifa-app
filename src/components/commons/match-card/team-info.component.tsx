import { FC, memo, useState } from 'react';

import { Stack, Avatar, Typography, Skeleton } from '@mui/material';

interface TeamInfoProps {
	img: string;
	shield_url: string;
	country: string;
}

const FALLBACK_LOGO =
	'https://ruizhealytimes.com/wp-content/uploads/2015/05/fifa.png';

const TeamInfo: FC<TeamInfoProps> = ({
	img,
	shield_url,
	country,
}): JSX.Element => {
	const [loaded, setLoaded] = useState<boolean>(false);

	return (
		<Stack
			direction="row"
			justifyContent="flex-start"
			alignItems="center"
			spacing={1}
		>
			<Avatar
				src={img || shield_url || FALLBACK_LOGO}
				alt={country}
				imgProps={{ onLoad: () => setLoaded(true) }}
				sx={{ display: loaded ? 'flex' : 'none' }}
			/>
			{!loaded && (
				<Skeleton variant="circular" sx={{ margin: 0, padding: 0 }}>
					<Avatar />
				</Skeleton>
			)}
			<Typography variant="body1">{country}</Typography>
		</Stack>
	);
};

export default memo(TeamInfo);
