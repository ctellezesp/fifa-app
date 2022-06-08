import { FC } from 'react';

import { Grid, Box, Paper } from '@mui/material';
import { ComponentType } from '../../../models/component.model';

const boxPaperStyles = {
	padding: '10px',
};

const ViewerComponent: FC<ComponentType> = ({ children }): JSX.Element => (
	<Grid container justifyContent="center" alignItems="center">
		<Grid item xs={12} md={10} lg={8}>
			<Paper elevation={2}>
				<Box sx={boxPaperStyles}>{children}</Box>
			</Paper>
		</Grid>
	</Grid>
);

export default ViewerComponent;
