import { FC, useState, ChangeEvent, KeyboardEvent } from 'react';

import { Box, IconButton, InputBase, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';

interface SearchBarProps {
	onSearch: (searchValue: string) => void;
	onCancel: () => void;
}

const SearchBarComponent: FC<SearchBarProps> = ({
	onSearch,
	onCancel,
}): JSX.Element => {
	const [searchValue, setSearchValue] = useState<string>('');

	const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>): void => {
		const { value } = event.currentTarget;
		if (!value) {
			onCancel();
		}
		setSearchValue(value);
	};

	const view = (event: KeyboardEvent<HTMLInputElement>) => {
		const { keyCode } = event;
		if (keyCode === 13) {
			onSearch(searchValue);
		}
	};

	const handleCancel = (): void => {
		setSearchValue('');
		onCancel();
	};

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				width: '100%',
			}}
		>
			<InputBase
				sx={{ ml: 1, flex: 1 }}
				placeholder="Search here..."
				inputProps={{ 'aria-label': 'search', onKeyUp: view }}
				value={searchValue}
				onChange={handleChangeSearch}
			/>
			<IconButton
				sx={{ p: '10px' }}
				aria-label="search"
				onClick={() => onSearch(searchValue)}
			>
				<SearchIcon />
			</IconButton>
			<Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
			<IconButton sx={{ p: '10px' }} aria-label="cancel" onClick={handleCancel}>
				<CancelIcon />
			</IconButton>
		</Box>
	);
};

export default SearchBarComponent;
