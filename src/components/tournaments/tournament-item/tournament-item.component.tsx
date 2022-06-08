import { FC, useContext } from 'react';

import { Typography, Stack, TextField, Grid } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { parse as getQueries } from 'query-string';

import { Tournament } from '../../../models/tournament.model';
import ViewerComponent from '../../commons/viewer/viewer.component';
import {
	addTournamentItem,
	updateTournamentItem,
} from '../../../services/tournaments.service';
import { AppContext } from '../../../context/app.context';

const tournamentSchema = Yup.object().shape({
	name: Yup.string().required('Name is required!'),
	season: Yup.string()
		.required('Season is required!')
		.matches(/^[0-9-]{4,9}/),
	image: Yup.string().required('Image is required!').url(),
	identifier: Yup.string(),
});

const TournamentItemComponent: FC = (): JSX.Element => {
	const location = useLocation();
	const params = useParams();
	const history = useHistory();
	const { addTournament, getTournament, editTournament } =
		useContext(AppContext);
	const { enqueueSnackbar } = useSnackbar();

	const { mode, tournamentId } = getQueries(location.search);

	console.log({
		location,
		params,
		mode,
		tournamentId,
	});

	const getTournamentItem = (tournament_id: string): Tournament => {
		return getTournament(tournament_id) as Tournament;
	};

	return (
		<ViewerComponent>
			<Stack spacing={2}>
				<Typography variant="h4" align="center">
					{mode === 'edit' ? 'Edit Tournament' : 'Add Tournament'}
				</Typography>
				<Formik
					initialValues={
						tournamentId
							? getTournamentItem(tournamentId as string)
							: {
									name: '',
									season: '',
									image: '',
									identifier: '',
							  }
					}
					validationSchema={tournamentSchema}
					onSubmit={async (values: Tournament, { setSubmitting }) => {
						setSubmitting(true);
						if (mode === 'edit') {
							const tournamentEditResponse = await updateTournamentItem(
								tournamentId as string,
								values
							);
							if (tournamentEditResponse) {
								editTournament(
									tournamentEditResponse.id,
									tournamentEditResponse
								);
								enqueueSnackbar(`${tournamentEditResponse.name} edited`, {
									variant: 'success',
									resumeHideDuration: 3000,
									anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
								});
								history.push('/tournaments');
							} else {
								enqueueSnackbar(`An error ocurrer`, {
									variant: 'error',
									resumeHideDuration: 5000,
									anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
								});
							}
						} else {
							const tournamentResponse = await addTournamentItem(values);
							setSubmitting(false);
							if (tournamentResponse) {
								addTournament(tournamentResponse);
								enqueueSnackbar(`${tournamentResponse.name} added`, {
									variant: 'success',
									resumeHideDuration: 3000,
									anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
								});
								history.push('/tournaments');
							} else {
								enqueueSnackbar(`An error ocurrer`, {
									variant: 'error',
									resumeHideDuration: 5000,
									anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
								});
							}
						}
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
						} = props;

						const isValidForm: boolean = isEmpty(errors);

						return (
							<Grid container spacing={1}>
								<Grid item xs={10}>
									<form onSubmit={handleSubmit}>
										<Stack spacing={2}>
											<TextField
												fullWidth
												name="name"
												variant="outlined"
												onChange={handleChange}
												label="Name"
												onBlur={() => setFieldTouched('name')}
												defaultValue={values.name}
												helperText={
													touched.name &&
													errors.name && (
														<Typography variant="caption" color="error">
															{errors.name}
														</Typography>
													)
												}
											/>
											<TextField
												fullWidth
												name="identifier"
												variant="outlined"
												onChange={handleChange}
												label="Identifier"
												onBlur={() => setFieldTouched('identifier')}
												defaultValue={values.identifier}
												helperText={
													touched.identifier &&
													errors.identifier && (
														<Typography variant="caption" color="error">
															{errors.identifier}
														</Typography>
													)
												}
											/>
											<TextField
												fullWidth
												name="season"
												variant="outlined"
												onChange={handleChange}
												label="Season"
												onBlur={() => setFieldTouched('season')}
												defaultValue={values.season}
												helperText={
													touched.season &&
													errors.season && (
														<Typography variant="caption" color="error">
															{errors.season}
														</Typography>
													)
												}
											/>
											<TextField
												fullWidth
												name="image"
												variant="outlined"
												onChange={handleChange}
												label="Image"
												onBlur={() => setFieldTouched('image')}
												defaultValue={values.image}
												helperText={
													touched.image &&
													errors.image && (
														<Typography variant="caption" color="error">
															{errors.image}
														</Typography>
													)
												}
											/>
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
								</Grid>
								<Grid item xs={2}>
									{values.image && (
										<img
											alt={values.name}
											src={values.image}
											width="90%"
											height="auto"
										/>
									)}
								</Grid>
							</Grid>
						);
					}}
				</Formik>
			</Stack>
		</ViewerComponent>
	);
};

export default TournamentItemComponent;
