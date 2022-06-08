export interface TableHeader {
	label: string;
	value: string;
	type: string;
}

export interface ITable {
	headers: TableHeader[];
	data: any[];
	actions: boolean;
	handleEdit?: (item: any) => void;
	handleDelete?: (item: any) => void;
  searchField: string;
  sortByField: string;
}