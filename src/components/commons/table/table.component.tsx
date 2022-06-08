import { ChangeEvent, FC, useEffect, useState } from 'react';

import {
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableCell,
	TableBody,
	TableRow,
	Stack,
	IconButton,
	Typography,
	Avatar,
	InputBase,
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
	DialogContentText,
	Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { orderBy, sortBy } from 'lodash';

import { ITable, TableHeader } from '../../../models/table.model';

const TableComponent: FC<ITable> = ({
	headers,
	data,
	actions,
	searchField,
	sortByField,
	handleEdit,
	handleDelete,
}): JSX.Element => {
	const [display, setDisplay] = useState<any[]>(sortBy(data, sortByField));
	const [modal, setModal] = useState({
		open: false,
		item: null,
	});

	const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
		const { value } = event.currentTarget;
		const searchValues = value.toLowerCase();
		const filtered = data.filter((item) =>
			item[searchField].toLowerCase().includes(searchValues)
		);
		setDisplay(orderBy(filtered, sortByField));
	};

	useEffect(() => {
		setDisplay(orderBy(data, sortByField));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	const handleModal = (row: any) => {
		setModal({
			open: true,
			item: row,
		});
	};

	const handleClose = () => {
		setModal({
			open: false,
			item: null,
		});
	};

	const handleConfirmDelete = (row: any) => {
		if (handleDelete) {
			handleDelete(row);
		}
		handleClose();
	};

	return (
		<>
			<TableContainer component={Paper}>
				<Stack spacing={1}>
					<Paper
						component="form"
						sx={{
							p: '2px 4px',
							display: 'flex',
							alignItems: 'center',
							width: '100%',
						}}
					>
						<InputBase
							sx={{ ml: 1, flex: 1 }}
							placeholder="Search here..."
							inputProps={{ 'aria-label': 'search' }}
							onChange={handleSearch}
						/>
						<IconButton
							type="submit"
							sx={{ p: '10px' }}
							aria-label="search"
							disabled
						>
							<SearchIcon />
						</IconButton>
					</Paper>
					<Table sx={{ width: '100%' }} aria-label="table">
						<TableHead>
							<TableRow>
								{headers.map((header: TableHeader) => (
									<TableCell key={header.value}>{header.label}</TableCell>
								))}
								{actions && <TableCell align="right">Actions</TableCell>}
							</TableRow>
						</TableHead>
						<TableBody>
							{display.length > 0 &&
								display.map((row: any) => (
									<TableRow
										key={row.id}
										sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
									>
										{headers.map((header: TableHeader) => (
											<TableCell>
												{header.type === 'text' ? (
													<Typography variant="body2">
														{row[header.value]}
													</Typography>
												) : (
													<Avatar
														alt={row[header.label]}
														src={row[header.value]}
													/>
												)}
											</TableCell>
										))}
										{actions && (
											<TableCell align="right">
												<Stack
													direction="row"
													justifyContent="center"
													spacing={2}
												>
													<IconButton
														color="primary"
														aria-label="edit"
														component="span"
														onClick={() =>
															(handleEdit && handleEdit(row)) || null
														}
													>
														<EditIcon />
													</IconButton>
													<IconButton
														color="error"
														aria-label="delete"
														component="span"
														onClick={() => handleModal(row)}
													>
														<DeleteIcon />
													</IconButton>
												</Stack>
											</TableCell>
										)}
									</TableRow>
								))}
						</TableBody>
					</Table>
				</Stack>
			</TableContainer>
			<Dialog
				open={modal.open}
				onClose={handleClose}
				aria-labelledby="dialog-delete"
				aria-describedby="dialog-delete-desc"
			>
				<DialogTitle id="dialog-delete">
					Do you want to delete this item?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="dialog-delete-desc">
						Once you delete it, you can not retrieve it
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={() => handleConfirmDelete(modal.item)} autoFocus>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default TableComponent;