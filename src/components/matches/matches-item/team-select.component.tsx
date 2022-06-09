import { FC, useState } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { orderBy } from 'lodash';
import { Team } from '../../../models/team.model';

interface TeamSelectProps {
	options: Team[];
	teamOption: 'homeId' | 'awayId';
	handleChange: Function;
	defaultValue: Team | null;
}

const TeamSelect: FC<TeamSelectProps> = ({
	options,
	handleChange,
	teamOption,
	defaultValue,
}): JSX.Element => {
	const [value, setValue] = useState<Team | null>(defaultValue);
	const [inputValue, setInputValue] = useState('');

	return (
		<Autocomplete
			value={value}
			onChange={(event: any, newValue: Team | null) => {
				setValue(newValue);
				handleChange(teamOption, newValue?.id as string);
			}}
			inputValue={inputValue}
			onInputChange={(event, newInputValue) => {
				setInputValue(newInputValue);
			}}
			id="team"
			getOptionLabel={(option) => option.country}
			options={orderBy(options, 'country')}
			sx={{ width: '100%' }}
			renderInput={(params) => (
				<TextField
					{...params}
					label={teamOption === 'homeId' ? 'Home' : 'Away'}
				/>
			)}
		/>
	);
};

export default TeamSelect;
