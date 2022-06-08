import { FC, useEffect, useContext, useState } from 'react';

import { Paper, Stack, Typography } from '@mui/material';
import { orderBy } from 'lodash';

import { AppContext } from '../../context/app.context';
import { Tournament } from '../../models/tournament.model';
import { getTournamentsItems } from '../../services/tournaments.service';
import SpinnerComponent from '../commons/spinner/spinner.component';
import { FAKE_TOURNAMENT } from '../../constants/tournaments.constants';

import './home.styles.css';

const HomeComponent: FC = (): JSX.Element => {
	const { fetchTournaments, tournaments } = useContext(AppContext);

	const [tournamentsDisplay, setTournaments] = useState<Tournament[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [state, setState] = useState({
		tournament: FAKE_TOURNAMENT,
	});

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

	const handleTournament = (tournament: Tournament): void => {
		setState({
			...state,
			tournament,
		});
	};

	return loading ? (
		<SpinnerComponent />
	) : (
		<div>
			<div className="leagues-scroll">
				{orderBy(tournamentsDisplay, 'season').map((tournament: Tournament) => (
					<div
						key={tournament.id}
						className={`scroll-item MuiPaper-elevation6`}
					>
						<img
							className="league-img-scroll"
							alt={tournament.name}
							src={tournament.image}
							onClick={() => handleTournament(tournament)}
						/>
					</div>
				))}
			</div>
			<Stack direction="row" justifyContent="center" sx={{ margin: '10px 0' }}>
				{state.tournament && (
					<Paper sx={{ padding: '10px' }}>
						<Typography variant="h6" align="center">
							{`${state?.tournament?.name} ${state?.tournament?.season}`}
						</Typography>
					</Paper>
				)}
			</Stack>
		</div>
	);
};

export default HomeComponent;
