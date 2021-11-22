import { inject, InjectionKey, provide, ref } from 'vue';
import { TableRow } from '@/types';

export type TableState = ReturnType<typeof provideTableState>;

const stateKey: InjectionKey<TableState> = Symbol('table-state');

export const injectTableState = () => inject(stateKey);

export function provideTableState () {
  const tableData = ref<TableRow[]>();
  const collapsedTables = ref<Record<number, boolean>>({});


  const toggleTables = (tableId: number) => {
    collapsedTables.value = {
      ...collapsedTables.value,
      [tableId]: !collapsedTables.value[tableId]
    }
  }

  const setTableData = (data: TableRow[]) => {
    tableData.value = data.map(value => addIterateKeys(value));

    function addIterateKeys (row: TableRow) {
      (Object.keys(row.kids) || []).map(key => {
        row.kids[key] = {
          id: generateId(),
          records: row.kids[key]?.records
            .map(kidValue => addIterateKeys(kidValue))
        }
        collapsedTables.value[row.kids[key].id] = true
      })


      const id = generateId();
      collapsedTables.value[id] = true

      return {
        ...row,
        id,
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
        row.kids[key].records = row.kids[key]?.records.filter(kidValue => deleteRowWithId(kidValue))
      })

      return row.id !== rowId
    }
  }

  const state = {
    setTableData,
    toggleTables,
    deleteRow,
    collapsedTables,
    tableData
  }

  provide(stateKey, state);

  return {
    setTableData,
    toggleTables,
    deleteRow,
    collapsedTables,
    tableData
  }
}


const generateId = () => {
  return Number('1' + Math.random().toString().slice(2,10))
}