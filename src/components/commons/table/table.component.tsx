import { FC, useEffect, useState } from 'react';

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
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
	DialogContentText,
	Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { orderBy } from 'lodash';

import { ITable, TableHeader } from '../../../models/table.model';
import SearchBarComponent from '../search-bar/search-bar.component';

const TableComponent: FC<ITable> = ({
	headers,
	data,
	actions,
	searchField,
	sortByField,
	handleEdit,
	handleDelete,
}): JSX.Element => {
	const [orderType, setOrderType] = useState<'asc' | 'desc'>('desc');
	const [display, setDisplay] = useState<any[]>(data);
	const [modal, setModal] = useState({
		open: false,
		item: null,
	});

	const doSearch = (searchValue: string): void => {
		const filtered = data.filter((item) =>
			item[searchField].toLowerCase().includes(searchValue.toLowerCase())
		);
		setDisplay(filtered);
	};

	const cleanSearch = (): void => {
		setDisplay(data);
	};

	useEffect(() => {
		setDisplay(data);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data.length]);

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
						sx={{
							p: '2px 4px',
							display: 'flex',
							alignItems: 'center',
							width: '100%',
						}}
					>
						<SearchBarComponent onSearch={doSearch} onCancel={cleanSearch} />
					</Paper>
					<Stack direction="row" justifyContent="flex-end">
						<IconButton
							sx={{ p: '10px' }}
							aria-label="sort"
							onClick={() => setOrderType(orderType === 'asc' ? 'desc' : 'asc')}
						>
							<FilterListIcon />
						</IconButton>
					</Stack>
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
								orderBy(display, sortByField, orderType).map((row: any) => (
									<TableRow
										key={row.id}
										sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
									>
										{headers.map((header: TableHeader) => (
											<TableCell key={`${row.id}@${header.value}`}>
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
													justifyContent="flex-end"
													spacing={1}
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
							{display.length === 0 && (
								<TableRow sx={{ padding: '10px' }}>
									<TableCell
										colSpan={actions ? headers.length + 1 : headers.length}
									>
										<Typography variant="body1" align="center">
											No items found
										</Typography>
									</TableCell>
								</TableRow>
							)}
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
