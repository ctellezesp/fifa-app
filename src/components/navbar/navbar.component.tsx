import { FC } from 'react';

import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';

const Navbar: FC = (): JSX.Element => {
	const history = useHistory();
	const { pathname } = useLocation();

	const redirectTo = (path: string): void => {
		history.push(path);
	};

	return (
		<Box sx={{ flexGrow: 1, marginBottom: '10px' }}>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						FIFA
					</Typography>
					{pathname !== '/' && (
						<Button color="inherit" onClick={() => redirectTo('/dashboard')}>
							Dashboard
						</Button>
					)}
					<Button color="inherit" onClick={() => redirectTo('/')}>
						Home
					</Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
};

export default Navbar;
