'use client';

import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { skipToken, useQuery } from "@tanstack/react-query";
import { Pagination } from "./pagination";
import type { ApiResponse, PaginationType } from "@/types/api-response";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  className?: string;
  render?: (item: T) => React.ReactNode;
}

type BaseTableProps<T extends { id: number }> = {
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  filterKeys?: string[];
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  ActivatePagination?: boolean;
};

type FetchTableProps<T> = {
  queryKey: readonly unknown[];
  queryFn: () => Promise<ApiResponse<T>>;
  data?: never;
};

type DirectTableProps<T> = {
  data: T[];
  queryKey?: never;
  queryFn?: never;
};

// 💎 New: Table design system options
type TableVariant = "default" | "modern" | "minimal";
type TableDensity = "compact" | "comfortable" | "spacious";

type TableStyleProps = {
  variant?: TableVariant;
  density?: TableDensity;
  striped?: boolean;
  hoverable?: boolean;
  clickableRows?: boolean;
};

export type DataTableProps<T extends { id: number }> =
  BaseTableProps<T> &
  TableStyleProps &
  (FetchTableProps<T> | DirectTableProps<T>);

// Type guard for fetch mode
function isFetchMode<T extends { id: number }>(
  props: DataTableProps<T>
): props is BaseTableProps<T> & FetchTableProps<T> {
  return (
    (props as Partial<FetchTableProps<T>>).queryKey !== undefined &&
    (props as Partial<FetchTableProps<T>>).queryFn !== undefined
  );
}

export function DataTable<T extends { id: number }>(props: DataTableProps<T>) {
  const {
    columns,
    onRowClick,
    emptyMessage = "No data found.",
    onClearFilters,
    hasActiveFilters = false,
    ActivatePagination = true,
    variant = "modern",
    density = "comfortable",
    striped = false,
    hoverable = true,
    clickableRows = false,
  } = props;

  const fetchMode = isFetchMode(props);

  // Fetch data if fetchMode
  const { data: fetchedData, isLoading, isFetching } = useQuery<ApiResponse<T>>({
    queryKey: fetchMode ? props.queryKey : ["datatable", "direct"],
    queryFn: fetchMode ? props.queryFn : skipToken,
    enabled: fetchMode,
  });

  const items: T[] = fetchMode ? (fetchedData?.data ?? []) : props.data;

  const defaultPagination: PaginationType = {
    currentPage: 1,
    perPage: 15,
    total: 0,
    lastPage: 1,
    from: 0,
    to: 0,
  };

  const pagination: PaginationType = fetchMode
    ? (fetchedData?.pagination ?? defaultPagination)
    : {
        currentPage: 1,
        perPage: props.data.length,
        total: props.data.length,
        lastPage: 1,
        from: props.data.length ? 1 : 0,
        to: props.data.length,
      };

  // Density styles
  const densityStyles = {
    compact: "py-2 px-3 text-xs",
    comfortable: "py-4 px-5 text-sm",
    spacious: "py-5 px-6 text-base",
  };

  // Variant styles
  const variantStyles = {
    default: {
      table: "border border-border rounded-lg",
      header: "bg-muted/50",
      row: "border-b",
    },
    modern: {
      table: "bg-white rounded-2xl shadow-sm overflow-hidden",
      header: "bg-slate-50/80 text-slate-600",
      row: "border-b border-slate-100",
    },
    minimal: {
      table: "",
      header: "text-muted-foreground",
      row: "",
    },
  };

  return (
    <div>
      <Table className={cn(variantStyles[variant].table)}>
        <TableHeader className={variantStyles[variant].header}>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  "text-center font-medium",
                  densityStyles[density],
                  column.className
                )}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {(isLoading || isFetching) ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((column) => (
                  <TableCell key={column.key} className={cn(densityStyles[density])}>
                    <div className="h-4 w-full animate-pulse rounded-md bg-slate-200" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-3 py-10">
                  <div className="rounded-full bg-slate-100 p-4">
                    <Search className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500">
                    {hasActiveFilters
                      ? "لا توجد نتائج مطابقة للفلاتر"
                      : emptyMessage}
                  </p>
                  {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={onClearFilters}>
                      مسح الفلاتر
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            items.map((item, rowIndex) => (
              <TableRow
                key={item.id}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
                className={cn(
                  variantStyles[variant].row,
                  hoverable && "transition-colors hover:bg-slate-50",
                  striped && rowIndex % 2 === 0 && "bg-slate-50/50",
                  (onRowClick || clickableRows) && "cursor-pointer"
                )}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      "text-center text-slate-700",
                      densityStyles[density],
                      column.className
                    )}
                  >
                    {column.render
                      ? column.render(item)
                      : String((item as Record<string, unknown>)[column.key] ?? "N/A")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {ActivatePagination && (
        <div className="mt-6">
          <Pagination pagination={pagination} isLoading={isLoading || isFetching} />
        </div>
      )}
    </div>
  );
}