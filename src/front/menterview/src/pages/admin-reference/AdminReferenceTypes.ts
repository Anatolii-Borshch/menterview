export type TableKey = 'categories' | 'difficulties' | 'levels' | 'tags' | 'countries' | 'languages' | 'themes' | 'roles';

export interface TableItem {
  id: number;
  name: string;
}

export interface TableState {
  items: TableItem[];
  loading: boolean;
  newName: string;
  editingId: number | null;
  editingName: string;
  saving: boolean;
}
