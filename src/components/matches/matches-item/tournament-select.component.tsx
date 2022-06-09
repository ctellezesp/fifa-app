import { FC, useState } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { orderBy } from 'lodash';

import { Tournament } from '../../../models/tournament.model';

interface TournamentSelectProps {
	options: Tournament[];
	handleChange: Function;
	defaultValue: Tournament | null;
}

const TournamentSelect: FC<TournamentSelectProps> = ({
	options,
	handleChange,
	defaultValue,
}): JSX.Element => {
	const [value, setValue] = useState<Tournament | null>(defaultValue);
	const [inputValue, setInputValue] = useState('');

	return (
		<Autocomplete
			value={value}
			onChange={(event: any, newValue: Tournament | null) => {
				setValue(newValue);
				handleChange('tournamentId', newValue?.id as string);
			}}
			inputValue={inputValue}
			onInputChange={(event, newInputValue) => {
				setInputValue(newInputValue);
			}}
			id="tournamentId"
			getOptionLabel={(option) => `${option.name} ${option.season}`}
			options={orderBy(options, 'season')}
			sx={{ width: '100%' }}
			renderInput={(params) => <TextField {...params} label="Tournament" />}
		/>
	);
};

export default TournamentSelect;
