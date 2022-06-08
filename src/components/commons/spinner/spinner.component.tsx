import { FC } from 'react';

import { Backdrop, CircularProgress } from '@mui/material';

interface ISpinnerComponent {
	color?: string;
}

const SpinnerComponent: FC<ISpinnerComponent> = ({
	color = '#FFFFFF',
}): JSX.Element => (
	<Backdrop
		sx={{ color, zIndex: (theme) => theme.zIndex.drawer + 1 }}
		open={true}
	>
		<CircularProgress color="inherit" />
	</Backdrop>
);

export default SpinnerComponent;
