import React, { FC, useEffect, useContext, useState } from 'react';

import {
	Box,
	Paper,
	Stack,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	IconButton,
	useMediaQuery,
	Slide,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from '@mui/material/transitions';
import { orderBy } from 'lodash';

import { AppContext } from '../../context/app.context';
import { Tournament } from '../../models/tournament.model';
import SpinnerComponent from '../commons/spinner/spinner.component';

import LeaguesScrollComponent from '../commons/leagues-scroll/leagues-scroll.component';
import { IMatch } from '../../models/match.model';
import { getMatchesItems } from '../../services/matches.service';
import MatchCardComponent from '../commons/match-card/match-card.component';
import { FAKE_MATCH } from '../../constants/match.constants';
import { matchTitleUtil } from '../../utils/match-title.util';
import MatchTabsComponent from '../commons/match-tabs/match-tabs.component';
import PlayerComponent from '../commons/player/player.component';

interface IMatchModal {
	open: boolean;
	match: IMatch;
}

const boxMatchesStyles = {
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
	gap: '10px',
	padding: '0 10px',
};

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const HomeComponent: FC = (): JSX.Element => {
	const { fetchTournaments, matches, fetchMatches, fetchTeams, tournaments } =
		useContext(AppContext);

	const [tournamentsDisplay, setTournaments] = useState<Tournament[]>([]);
	const [allMatches, setAllMatches] = useState<IMatch[]>([]);
	const [matchesDisplay, setMatchesDisplay] = useState<IMatch[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [activeTournament, setTournament] = useState<Tournament | null>(null);
	const [matchModal, setMatchModal] = useState<IMatchModal>({
		open: false,
		match: FAKE_MATCH,
	});
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const generateTitle = (match: IMatch) => {
		return match ? (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<img
					height="30px"
					style={{ margin: '0 10px 0 0' }}
					src={match.tournament?.image}
					alt={match.tournament?.name}
				/>
				<Typography variant="body1">
					{matchTitleUtil(match, isMobile)}
				</Typography>
			</div>
		) : (
			''
		);
	};

	useEffect(() => {
		const retrieveMatches = async () => {
			if (matches.length) {
				setTournaments(tournaments);
				setAllMatches(matches);
				setLoading(false);
				return;
			}
			const matchesResponse = await getMatchesItems();
			if (matchesResponse) {
				const {
					matchesItems,
					tournaments: tournamentsItems,
					teams,
				} = matchesResponse;
				fetchTournaments(tournamentsItems);
				fetchMatches(matchesItems);
				fetchTeams(teams);
				setAllMatches(matchesItems);
				setTournaments(tournamentsItems);
				setLoading(false);
			}
		};
		retrieveMatches();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleTournament = (tournament: Tournament): void => {
		const filtered = allMatches.filter(
			(matchItem: IMatch) => matchItem.tournamentId === tournament.id
		);
		setMatchesDisplay(filtered);
		setTournament(tournament);
	};

	const handleClickMatch = (match: IMatch): void => {
		setMatchModal({
			open: true,
			match,
		});
	};

	const handleCloseModal = (): void => {
		setMatchModal({
			open: false,
			match: FAKE_MATCH,
		});
	};

	return loading ? (
		<SpinnerComponent />
	) : (
		<div>
			<LeaguesScrollComponent
				tournaments={tournamentsDisplay}
				handleTournament={handleTournament}
			/>
			<Stack direction="row" justifyContent="center" sx={{ margin: '10px 0' }}>
				{activeTournament ? (
					<Paper sx={{ padding: '10px' }}>
						<Typography variant="h6" align="center">
							{`${activeTournament?.name} ${activeTournament?.season}`}
						</Typography>
					</Paper>
				) : (
					<img
						src="https://pngimg.com/uploads/fifa/fifa_PNG7.png"
						alt="FIFA"
						width="50%"
						height="auto"
					/>
				)}
			</Stack>
			<Box sx={boxMatchesStyles}>
				{matchesDisplay.length > 0 &&
					orderBy(matchesDisplay, 'date', 'desc').map((match: IMatch) => (
						<MatchCardComponent
							key={match.id}
							match={match}
							handleClick={(matchItem: IMatch) => handleClickMatch(matchItem)}
						/>
					))}
			</Box>
			{!matchesDisplay.length && activeTournament && (
				<Typography variant="body1" align="center" color="white">
					No matches found
				</Typography>
			)}
			<Dialog
				fullWidth={true}
				maxWidth={'lg'}
				open={matchModal.open}
				onClose={handleCloseModal}
				TransitionComponent={Transition}
				keepMounted
			>
				<DialogTitle sx={{ padding: '5px 24px' }}>
					{matchModal.match && generateTitle(matchModal.match)}
				</DialogTitle>
				<DialogContent sx={{ padding: '0px' }}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							width: '100%',
						}}
					>
						{matchModal.match.streams.length > 1 ? (
							<MatchTabsComponent streams={matchModal.match.streams} />
						) : (
							<PlayerComponent
								render={matchModal.match?.streams[0]?.frame || ''}
							/>
						)}
					</Box>
				</DialogContent>
				<IconButton
					sx={{
						position: 'absolute',
						top: '0',
						right: '0',
					}}
					aria-label="close"
					onClick={handleCloseModal}
				>
					<CloseIcon />
				</IconButton>
			</Dialog>
		</div>
	);
};

export default HomeComponent;
