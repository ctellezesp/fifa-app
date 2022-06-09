import { FC } from 'react';

import Box from '@mui/material/Box';

import './player.styles.css';

interface PlayerProps {
	render: string;
}

const PlayerComponent: FC<PlayerProps> = ({ render }) => {
	const frame = render.toString().includes('http')
		? render
		: `https://drive.google.com/file/d/${render}/preview`;

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100%',
				width: '100%',
				position: 'relative',
			}}
		>
			<div className="video-container">
				<iframe
					title="frame"
					src={frame}
					width="100%"
					height="auto"
					allowFullScreen
				></iframe>
				<span className="loading-text">Loading Video...</span>
			</div>
		</Box>
	);
};

export default PlayerComponent;
