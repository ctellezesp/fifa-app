import React, { FC } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import { MatchStream } from '../../../models/match.model';
import PlayerComponent from '../player/player.component';

interface MatchTabsProps {
	streams: MatchStream[];
}

const MatchTabsComponent: FC<MatchTabsProps> = ({ streams }): JSX.Element => {
	const [value, setValue] = React.useState('1');

	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: '100%', typography: 'body1', padding: '0px' }}>
			<TabContext value={value}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<TabList
						sx={{ padding: '0px' }}
						onChange={handleChange}
						aria-label="options"
						variant="scrollable"
						scrollButtons="auto"
						allowScrollButtonsMobile
					>
						{streams.map((stream: MatchStream, index: number) => (
							<Tab
								key={`${stream.frame}@${stream.label}@${index}`}
								label={stream.label}
								value={`${index + 1}`}
							/>
						))}
					</TabList>
				</Box>
				{streams.map((stream: MatchStream, idx: number) => (
					<TabPanel
						key={`${stream}@${idx}`}
						value={`${idx + 1}`}
						sx={{ padding: '0px' }}
					>
						<PlayerComponent render={stream.frame} />
					</TabPanel>
				))}
			</TabContext>
		</Box>
	);
};

export default MatchTabsComponent;
