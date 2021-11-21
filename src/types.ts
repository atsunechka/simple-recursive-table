export interface TableRow {
  data: Record<string, string>,
  id: number,
  kids: Record<string, {
    id: number,
    records: TableRow[]
  }>
}
