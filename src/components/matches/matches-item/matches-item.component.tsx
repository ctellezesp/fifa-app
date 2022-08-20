/* eslint-disable react-hooks/rules-of-hooks */
import React, { FC, useContext, useEffect, useState } from 'react';

import {
	Typography,
	Stack,
	TextField,
	Grid,
	Button,
	IconButton,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useLocation, useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { parse as getQueries } from 'query-string';
import { getUnixTime, fromUnixTime } from 'date-fns';

import { AppContext } from '../../../context/app.context';
import ViewerComponent from '../../commons/viewer/viewer.component';
import { Team } from '../../../models/team.model';
import { getTeamsItems } from '../../../services/teams.service';
import SpinnerComponent from '../../commons/spinner/spinner.component';
import { Tournament } from '../../../models/tournament.model';
import { getTournamentsItems } from '../../../services/tournaments.service';
import { FAKE_MATCH } from '../../../constants/match.constants';
import { IMatch, MatchStream } from '../../../models/match.model';
import TournamentSelect from './tournament-select.component';
import TeamSelect from './team-select.component';
import {
	addMatchItem,
	updateMatchItem,
} from '../../../services/matches.service';

const matchSchema = Yup.object().shape({
	title: Yup.string().required('Title is required!'),
	date: Yup.number().integer().min(1),
	tournamentId: Yup.string().required('Tournament is required!'),
	homeId: Yup.string().required('Home team is required!'),
	awayId: Yup.string().required('Away team is required!'),
	stadium: Yup.string().required('Stadium is required!'),
	streams: Yup.array()
		.min(1)
		.of(
			Yup.object().shape({
				label: Yup.string().required('Stream label is required!'),
				frame: Yup.string().required('Stream frame is required!'),
			})
		),
});

const MatchItemComponent: FC = (): JSX.Element => {
	const location = useLocation();
	const history = useHistory();
	const {
		addMatch,
		getMatch,
		editMatch,
		teams,
		fetchTeams,
		tournaments,
		fetchTournaments,
		getTournament,
		getTeam,
		setTournament,
	} = useContext(AppContext);
	const { enqueueSnackbar } = useSnackbar();

	const { mode, matchId } = getQueries(location.search);

	const [teamsDisplay, setTeamsDisplay] = useState<Team[]>([]);
	const [tournamentsDisplay, setTournamentsDisplay] = useState<Tournament[]>(
		[]
	);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const retrieveTeams = async () => {
			if (teams.length) {
				setTeamsDisplay(teams);
				return;
			}
			const teamsResponse = await getTeamsItems();
			if (teamsResponse) {
				setTeamsDisplay(teamsResponse);
				fetchTeams(teamsResponse);
			}
		};
		const retrieveTournaments = async () => {
			if (tournaments.length) {
				setTournamentsDisplay(tournaments);
				return;
			}
			const tournamentsResponse = await getTournamentsItems();
			if (tournamentsResponse) {
				setTournamentsDisplay(tournamentsResponse);
				fetchTournaments(tournamentsResponse);
			}
		};
		const getData = async () => {
			await retrieveTeams();
			await retrieveTournaments();
			setLoading(false);
		};
		getData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return loading ? (
		<SpinnerComponent />
	) : (
		<ViewerComponent>
			<Stack spacing={2}>
				<Typography variant="h4" align="center">
					{mode === 'edit' ? 'Edit Match' : 'Add Match'}
				</Typography>
				<Formik
					initialValues={
						matchId ? (getMatch(matchId as string) as IMatch) : FAKE_MATCH
					}
					validationSchema={matchSchema}
					onSubmit={async (values: IMatch, { setSubmitting }) => {
						setSubmitting(true);
						if (mode === 'edit') {
							const {
								title,
								date,
								tournamentId,
								homeId,
								awayId,
								stadium,
								streams,
							} = values;
							const dataToEdit: IMatch = {
								title,
								date,
								tournamentId,
								homeId,
								awayId,
								stadium,
								streams,
							};
							const itemEditResponse = await updateMatchItem(
								matchId as string,
								dataToEdit
							);
							if (itemEditResponse) {
								editMatch(matchId as string, itemEditResponse);
								enqueueSnackbar(`${values.title} edited`, {
									variant: 'success',
									resumeHideDuration: 3000,
									anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
								});
								history.push('/matches');
							} else {
								enqueueSnackbar(`An error ocurrer`, {
									variant: 'error',
									resumeHideDuration: 5000,
									anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
								});
							}
							setSubmitting(false);
						} else {
							const addMatchResponse = await addMatchItem(values);
							if (addMatchResponse) {
								addMatch(addMatchResponse);
								enqueueSnackbar(`${values.title} added`, {
									variant: 'success',
									resumeHideDuration: 3000,
									anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
								});
								history.push('/matches');
							} else {
								enqueueSnackbar(`An error ocurrer`, {
									variant: 'error',
									resumeHideDuration: 5000,
									anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
								});
							}
							setSubmitting(false);
						}
						setTournament(values.tournamentId);
					}}
				>
					{(props) => {
						const {
							handleChange,
							values,
							handleSubmit,
							errors,
							isSubmitting,
							touched,
							setFieldTouched,
							setFieldValue,
						} = props;

						const isValidForm: boolean = isEmpty(errors);

						const [value, setValue] = React.useState<Date | null>(
							matchId ? fromUnixTime(values.date) : new Date()
						);

						const handleChangeDate = (newValue: Date | null) => {
							setValue(newValue);
							const epoch = getUnixTime(newValue as Date);
							setFieldValue('date', epoch);
						};

						const createStream = () => {
							const newOption: MatchStream = {
								label: '',
								frame: '',
							};
							setFieldValue('streams', [...values.streams, newOption]);
						};

						const deleteStream = (index: number) => {
							const newOptions = values.streams.slice();
							newOptions.splice(index, 1);
							setFieldValue('streams', newOptions);
						};

						return (
							<form onSubmit={handleSubmit}>
								<Stack spacing={2}>
									<TextField
										fullWidth
										name="title"
										variant="outlined"
										onChange={handleChange}
										label="Title"
										onBlur={() => setFieldTouched('title')}
										defaultValue={values.title}
										helperText={
											touched.title &&
											errors.title && (
												<Typography variant="caption" color="error">
													{errors.title}
												</Typography>
											)
										}
									/>
									<LocalizationProvider dateAdapter={AdapterDateFns}>
										<DateTimePicker
											label="Date"
											onChange={handleChangeDate}
											value={value}
											renderInput={(params) => <TextField {...params} />}
										/>
									</LocalizationProvider>
									<TournamentSelect
										options={tournamentsDisplay}
										handleChange={setFieldValue}
										defaultValue={
											matchId
												? (getTournament(values.tournamentId) as Tournament)
												: null
										}
									/>
									<Stack direction="row" spacing={1}>
										<TeamSelect
											options={teamsDisplay}
											handleChange={setFieldValue}
											teamOption="homeId"
											defaultValue={
												matchId ? (getTeam(values.homeId) as Team) : null
											}
										/>
										<TeamSelect
											options={teamsDisplay}
											handleChange={setFieldValue}
											teamOption="awayId"
											defaultValue={
												matchId ? (getTeam(values.awayId) as Team) : null
											}
										/>
									</Stack>
									<TextField
										fullWidth
										name="stadium"
										variant="outlined"
										onChange={handleChange}
										label="Stadium"
										onBlur={() => setFieldTouched('stadium')}
										defaultValue={values.stadium}
										helperText={
											touched.stadium &&
											errors.stadium && (
												<Typography variant="caption" color="error">
													{errors.stadium}
												</Typography>
											)
										}
									/>
									<Button
										variant="outlined"
										type="button"
										onClick={createStream}
									>
										Add Stream
									</Button>
									{values.streams.length > 0 &&
										values.streams.map((stream: MatchStream, index: number) => (
											<Grid
												container
												justifyContent="center"
												alignItems="center"
												spacing={1}
												key={index}
											>
												<Grid item xs={12} md={3}>
													<TextField
														fullWidth
														name="label"
														variant="outlined"
														onChange={(event) =>
															setFieldValue(
																`streams[${index}].label`,
																event.target.value
															)
														}
														label="Label"
														value={stream.label || ''}
													/>
												</Grid>
												<Grid item xs={10} md={8}>
													<TextField
														fullWidth
														name="frame"
														variant="outlined"
														onChange={(event) =>
															setFieldValue(
																`streams[${index}].frame`,
																event.target.value
															)
														}
														label="Frame"
														value={stream.frame || ''}
													/>
												</Grid>
												<Grid item xs={2} md={1}>
													<Stack
														direction="row"
														justifyContent="center"
														alignItems="center"
													>
														<IconButton
															aria-label="deleteFrame"
															color="error"
															onClick={() => deleteStream(index)}
														>
															<DeleteIcon />
														</IconButton>
													</Stack>
												</Grid>
											</Grid>
										))}
									<Stack direction="row" justifyContent="flex-end">
										<LoadingButton
											loading={isSubmitting}
											variant="outlined"
											type="submit"
											disabled={!isValidForm}
										>
											Save
										</LoadingButton>
									</Stack>
								</Stack>
							</form>
						);
					}}
				</Formik>
			</Stack>
		</ViewerComponent>
	);
};

export default MatchItemComponent;
