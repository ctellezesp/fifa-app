import { FC } from 'react';

import { Grid, Box, Paper } from '@mui/material';
import { ComponentType } from '../../../models/component.model';

const ViewerComponent: FC<ComponentType> = ({
	children,
	paddingSize = '10px',
}): JSX.Element => {
	const boxPaperStyles = {
		padding: paddingSize,
	};
	return (
		<Grid container justifyContent="center" alignItems="center">
			<Grid item xs={11} md={10} lg={8}>
				<Paper elevation={2}>
					<Box sx={boxPaperStyles}>{children}</Box>
				</Paper>
			</Grid>
		</Grid>
	);
};

export default ViewerComponent;
