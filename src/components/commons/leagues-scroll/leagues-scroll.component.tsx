import { FC, useState } from 'react';

import { orderBy } from 'lodash';

import { Tournament } from '../../../models/tournament.model';
import './leagues-scroll.styles.css';
import { FAKE_TOURNAMENT } from '../../../constants/tournaments.constants';

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

	const onClickTournament = (tournament: Tournament): void => {
		setActiveTournament(tournament);
		handleTournament(tournament);
	};

	return (
		<div className="leagues-scroll">
			{orderBy(tournaments, 'season').map((tournament: Tournament) => (
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
