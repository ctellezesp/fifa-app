import { FC, useContext } from 'react';

import { Typography, Stack, TextField, Grid } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useLocation, useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { parse as getQueries } from 'query-string';

import ViewerComponent from '../../commons/viewer/viewer.component';
import { AppContext } from '../../../context/app.context';
import { Team } from '../../../models/team.model';
import { addTeamItem, updateTeamItem } from '../../../services/teams.service';

const teamSchema = Yup.object().shape({
	country: Yup.string().required('Name is required!'),
	abr: Yup.string(),
	img: Yup.string().required('Image is required!').url(),
	shield_url: Yup.string().url(),
});

const TeamItemComponent: FC = (): JSX.Element => {
	const location = useLocation();
	const history = useHistory();
	const { addTeam, getTeam, editTeam } = useContext(AppContext);
	const { enqueueSnackbar } = useSnackbar();

	const { mode, teamId } = getQueries(location.search);

	return (
		<ViewerComponent>
			<Stack spacing={2}>
				<Typography variant="h4" align="center">
					{mode === 'edit' ? 'Edit Team' : 'Add Team'}
				</Typography>
				<Formik
					initialValues={
						teamId
							? (getTeam(teamId as string) as Team)
							: {
									country: '',
									abr: '',
									img: '',
									shield_url: '',
							  }
					}
					validationSchema={teamSchema}
					onSubmit={async (values: Team, { setSubmitting }) => {
						setSubmitting(true);
						if (mode === 'edit') {
							const teamEditResponse = await updateTeamItem(
								teamId as string,
								values
							);
							if (teamEditResponse) {
								editTeam(teamEditResponse.id, teamEditResponse);
								enqueueSnackbar(`${teamEditResponse.country} edited`, {
									variant: 'success',
									resumeHideDuration: 3000,
									anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
								});
								history.push('/teams');
							} else {
								enqueueSnackbar(`An error ocurrer`, {
									variant: 'error',
									resumeHideDuration: 5000,
									anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
								});
							}
						} else {
							const teamResponse = await addTeamItem(values);
							setSubmitting(false);
							if (teamResponse) {
								addTeam(teamResponse);
								enqueueSnackbar(`${teamResponse.country} added`, {
									variant: 'success',
									resumeHideDuration: 3000,
									anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
								});
								history.push('/teams');
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
												name="country"
												variant="outlined"
												onChange={handleChange}
												label="Country name"
												onBlur={() => setFieldTouched('country')}
												defaultValue={values.country}
												helperText={
													touched.country &&
													errors.country && (
														<Typography variant="caption" color="error">
															{errors.country}
														</Typography>
													)
												}
											/>
											<TextField
												fullWidth
												name="abr"
												variant="outlined"
												onChange={handleChange}
												label="Abreviation"
												onBlur={() => setFieldTouched('abr')}
												defaultValue={values.abr}
												helperText={
													touched.abr &&
													errors.abr && (
														<Typography variant="caption" color="error">
															{errors.abr}
														</Typography>
													)
												}
											/>
											<TextField
												fullWidth
												name="img"
												variant="outlined"
												onChange={handleChange}
												label="Flag url"
												onBlur={() => setFieldTouched('img')}
												defaultValue={values.img}
												helperText={
													touched.img &&
													errors.img && (
														<Typography variant="caption" color="error">
															{errors.img}
														</Typography>
													)
												}
											/>
											<TextField
												fullWidth
												name="shield_url"
												variant="outlined"
												onChange={handleChange}
												label="Shield url"
												onBlur={() => setFieldTouched('shield_url')}
												defaultValue={values.shield_url}
												helperText={
													touched.shield_url &&
													errors.shield_url && (
														<Typography variant="caption" color="error">
															{errors.shield_url}
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
									<Stack spacing={2}>
										{values.img && (
											<img
												alt={values.country}
												src={values.img}
												width="90%"
												height="auto"
											/>
										)}
										{values.shield_url && (
											<img
												alt={values.country}
												src={values.shield_url}
												width="90%"
												height="auto"
											/>
										)}
									</Stack>
								</Grid>
							</Grid>
						);
					}}
				</Formik>
			</Stack>
		</ViewerComponent>
	);
};

export default TeamItemComponent;
