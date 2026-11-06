import {
  type ColumnDef,
  createColumnHelper,
  type RowData,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Skeleton } from './skeleton';

// Solo el modelo de filas base: ordenar y paginar lo hace la API con cursor (documento madre §19.2).
const features = tableFeatures({});
type Features = typeof features;

// Fallback estable: un `[]` nuevo en cada render obligaría a TanStack Table a recalcular las filas.
const NO_ROWS: ReadonlyArray<never> = [];

/** Ayudante tipado para definir las columnas de un DataTable: createDataTableColumns<Fila>().columns([...]). */
export const createDataTableColumns = <TData extends RowData>() =>
  createColumnHelper<Features, TData>();

export type DataTableColumns<TData extends RowData> = ReadonlyArray<ColumnDef<Features, TData>>;

export type DataTableProps<TData extends RowData> = {
  /** Defínelas fuera del componente (o en un useMemo) para que no cambien en cada render. */
  columns: DataTableColumns<TData>;
  /** Las filas tal cual las entrega TanStack Query; undefined mientras no hay respuesta. */
  data: ReadonlyArray<TData> | undefined;
  /** Nombre accesible de la tabla (se lee, no se ve). */
  caption: string;
  /** Se muestra cuando la respuesta llega sin filas; normalmente un <EmptyState>. */
  emptyState: ReactNode;
  loading?: boolean;
  /** Filas esqueleto durante la carga. */
  loadingRows?: number;
  getRowId?: (row: TData) => string;
  className?: string;
};

export function DataTable<TData extends RowData>({
  columns,
  data,
  caption,
  emptyState,
  loading = false,
  loadingRows = 5,
  getRowId,
  className,
}: DataTableProps<TData>) {
  const table = useTable({ features, columns, data: data ?? NO_ROWS, getRowId });
  const leafColumns = table.getAllLeafColumns();
  const rows = table.getRowModel().rows;

  let body: ReactNode;
  if (loading) {
    body = Array.from({ length: loadingRows }, (_, index) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: las filas esqueleto no tienen identidad y su orden no cambia.
      <tr key={index} className="border-tb-gris/30 border-t">
        {leafColumns.map((column) => (
          <td key={column.id} className="px-3 py-2.5">
            <Skeleton className="h-4 w-full" />
          </td>
        ))}
      </tr>
    ));
  } else if (rows.length === 0) {
    body = (
      <tr className="border-tb-gris/30 border-t">
        <td colSpan={leafColumns.length}>{emptyState}</td>
      </tr>
    );
  } else {
    body = rows.map((row) => (
      <tr key={row.id} className="border-tb-gris/30 border-t hover:bg-tb-gris/10">
        {row.getAllCells().map((cell) => (
          <td key={cell.id} className="px-3 py-2.5">
            <table.FlexRender cell={cell} />
          </td>
        ))}
      </tr>
    ));
  }

  return (
    <div className={cn('overflow-x-auto rounded-lg border border-tb-gris/40', className)}>
      <table aria-busy={loading || undefined} className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-tb-gris/10">
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th
                  key={header.id}
                  scope="col"
                  colSpan={header.colSpan}
                  className="px-3 py-2 font-semibold text-xs uppercase tracking-wide"
                >
                  {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>{body}</tbody>
      </table>
    </div>
  );
}
