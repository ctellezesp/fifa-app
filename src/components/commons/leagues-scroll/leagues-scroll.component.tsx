import { FC, useContext, useEffect, useState } from 'react';

import { IconButton, Box } from '@mui/material';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import { orderBy } from 'lodash';

import { Tournament } from '../../../models/tournament.model';
import { FAKE_TOURNAMENT } from '../../../constants/tournaments.constants';
import { SortBy } from '../../../models/sort-by.model';
import { AppContext } from '../../../context/app.context';
import { LeaguesScrollProps } from '../../../models/components/leagues-scroll.model';
import { boxParentStyles, iconSortStyles } from './leagues-scroll.style';
import './leagues-scroll.styles.css';

const LeaguesScrollComponent: FC<LeaguesScrollProps> = ({
	tournaments,
	handleTournament,
}): JSX.Element => {
	const [activeTournament, setActiveTournament] =
		useState<Tournament>(FAKE_TOURNAMENT);

	const { setTournament, selectedTournament, getTournament } =
		useContext(AppContext);

	const [sortBy, setSortBy] = useState<SortBy>('asc');

	const onClickTournament = (tournament: Tournament): void => {
		setActiveTournament(tournament);
		handleTournament(tournament);
		setTournament(tournament.id as string);
	};

	const toggleSortBy = () => {
		setSortBy(sortBy === 'asc' ? 'desc' : 'asc');
	};

	useEffect(() => {
		if (selectedTournament && activeTournament.id !== selectedTournament) {
			const currentTournament = getTournament(selectedTournament) as Tournament;
			setActiveTournament(currentTournament);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedTournament]);

	return (
		<Box sx={boxParentStyles}>
			<IconButton
				aria-label="sort"
				color="info"
				sx={iconSortStyles}
				onClick={toggleSortBy}
			>
				<SortByAlphaIcon />
			</IconButton>
			<div className="leagues-scroll">
				{orderBy(tournaments, 'season', sortBy).map(
					(tournament: Tournament) => (
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
					)
				)}
			</div>
		</Box>
	);
};

export default LeaguesScrollComponent;
