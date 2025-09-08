import { ColumnDef, OnChangeFn, SortingState } from "@tanstack/react-table";

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  emptyMessage?: string;
  className?: string;
}

export interface TableContainerProps<T> {
  title?: string;
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  pagination?: PaginationData;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
  actions?: React.ReactNode;
  className?: string;
}

export interface PaginationData {
  current_page: number;
  total_pages: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  total?: number;
  per_page?: number;
  from?: number;
  total_results?: number; 
  to?: number;
}

export interface TablePaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  loading?: boolean;
  showInfo?: boolean;
}