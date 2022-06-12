import { FC, useState } from 'react';

import IconButton from '@mui/material/IconButton';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';

import { orderBy } from 'lodash';

import { Tournament } from '../../../models/tournament.model';
import { FAKE_TOURNAMENT } from '../../../constants/tournaments.constants';
import { SortBy } from '../../../models/sort-by.model';
import './leagues-scroll.styles.css';

interface LeaguesScrollProps {
	tournaments: Tournament[];
	handleTournament: (tournament: Tournament) => void;
}

const LeaguesScrollComponent: FC<LeaguesScrollProps> = ({
	tournaments,
	handleTournament,
}): JSX.Element => {
	const [activeTournament, setActiveTournament] =
		useState<Tournament>(FAKE_TOURNAMENT);

	const [sortBy, setSortBy] = useState<SortBy>('asc');

	const onClickTournament = (tournament: Tournament): void => {
		setActiveTournament(tournament);
		handleTournament(tournament);
	};

	const toggleSortBy = () => {
		setSortBy(sortBy === 'asc' ? 'desc' : 'asc');
	};

	return (
		<div className="leagues-scroll">
			<IconButton
				aria-label="sort"
				color="info"
				sx={{ display: 'flex', placeItems: 'center', position: 'sticky' }}
				onClick={toggleSortBy}
			>
				<SortByAlphaIcon />
			</IconButton>
			{orderBy(tournaments, 'season', sortBy).map((tournament: Tournament) => (
				<div
					key={tournament.id}
					className={`scroll-item MuiPaper-elevation6 ${
						activeTournament.id === tournament.id ? 'active-tournament' : ''
					}`}
				>
					<img
						className="league-img-scroll"
						alt={tournament.name}
						src={tournament.image}
						onClick={() => onClickTournament(tournament)}
					/>
				</div>
			))}
		</div>
	);
};

export default LeaguesScrollComponent;
