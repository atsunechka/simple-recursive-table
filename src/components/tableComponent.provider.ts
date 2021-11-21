import { inject, InjectionKey, provide, ref } from 'vue';
import { TableRow } from '@/types';

export type TableState = ReturnType<typeof provideTableState>;

const stateKey: InjectionKey<TableState> = Symbol('table-state');

export const injectTableState = () => inject(stateKey);

export function provideTableState () {
  const tableData = ref<TableRow[]>();
  const collapsedTables = ref<number[]>([]);


  const toggleTables = (tableId: number) => {
    const hasCollapsed = collapsedTables.value?.indexOf(tableId);

    collapsedTables.value = hasCollapsed !== -1
        ? collapsedTables.value.filter(id => id !== tableId)
        : [
        ...collapsedTables.value,
        tableId
      ]
  }

  const hasCollapsedTable = (rowId: number) => collapsedTables.value.find(id => id === rowId)

  const setTableData = (data: TableRow[]) => {
    tableData.value = data.map(value => addIterateKeys(value));

    function addIterateKeys (row: TableRow) {
      (Object.keys(row.kids) || []).map(key => {
        row.kids[key] = {
          id: generateId(),
          records: row.kids[key]?.records
            .map(kidValue => addIterateKeys(kidValue))
        }
      })

      return {
        ...row,
        id: generateId(),
      }
    }
  }
  
  
  const deleteRow = (rowId: number) => {
    tableData.value = (tableData.value || [])
      .filter(value => deleteRowWithId(value))

    function deleteRowWithId (row: TableRow) {
      if (row.id === rowId)
        return false;

      (Object.keys(row.kids) || []).map(key => {
        row.kids[key].records =  row.kids[key]?.records.filter(kidValue => deleteRowWithId(kidValue))
      })

      return row.id !== rowId
    }
  }

  const state = {
    setTableData,
    toggleTables,
    deleteRow,
    collapsedTables,
    hasCollapsedTable,
    tableData
  }

  provide(stateKey, state);

  return {
    setTableData,
    toggleTables,
    deleteRow,
    collapsedTables,
    hasCollapsedTable,
    tableData
  }
}


const generateId = () => {
  return Number('1' + Math.random().toString().slice(2,10))
}