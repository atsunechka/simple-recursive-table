<template>
  <table :class="$style.child_table" >
    <caption :class=$style.child_title v-text="tableName"/>
    <template v-if="tableData?.length">
      <thead :class=$style.table_headers>
        <tr>
          <th></th>
          <th v-for="(headerName, key) in tableHeaders" :scope="headerName" v-text="headerName" :key="key" />
          <th></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="({ data, kids, id }, index) in tableData" :key="index">
          <tr >
            <td
              :class="[$style.collapse_arrow, collapsedTables[id] && $style.collapsed]"
              v-text="Object.keys(kids).length ? '>' : ''"
              @click="toggleTables(id)"
            />
            <td  v-for="(rowData, keyName) in data"
                 :key="keyName"
                 :scope="keyName"
                 :class="$style.table_key"
                 v-text="rowData"
            />
            <td :class="$style.delete_row" v-text="`X`" @click="deleteRow(id)"/>
          </tr>
          <template v-for="(_, childKey) in kids">
            <tr v-if="getRowKids(kids, childKey).length && !collapsedTables[id]" :class="$style.nested_table" :key="childKey" >
              <th :colspan="tableHeaders.length + 2">
                <TableComponent
                  :tableData="getRowKids(kids, childKey)"
                  :injectionProp="injectionProp"
                  :tableName="childKey"/>
              </th>
            </tr>
          </template>
        </template>
      </tbody>
    </template>

  </table>
</template>

<script lang="ts">
  import { computed, defineComponent, PropType } from 'vue';
  import { TableRow } from '@/types';
  import { TableState } from '@/components/tableComponent.provider';
  type KidRecords = Record<string, {records: TableRow[] }>

  export default defineComponent({
    name: 'TableComponent',
    props: {
      tableData: {
        type: Array as PropType<TableRow[]>,
        require: true
      },
      tableName: {
        type: String,
        require: true
      },
      injectionProp: {
        type: Function as PropType<() => TableState>,
        require: true
      }
    },
    setup(props) {
      const { toggleTables, collapsedTables, deleteRow } = props.injectionProp!();

      const tableHeaders = computed(() => {
        if (!props.tableData?.length)
          return [];

        return  Object.keys(props.tableData[0].data);
      })

      const getRowKids = (kids: KidRecords, childKey: keyof typeof kids) =>
        kids[childKey]?.records || []

      return {
        toggleTables,
        collapsedTables,
        deleteRow,
        tableHeaders,
        getRowKids
      }
    }
  })
</script>

<style lang="scss" module>
:root {
  --border-color: #525151;
}

.child_table {
  margin-left: 1rem;
  border-collapse: collapse;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

.child_title {
  padding-left: 1rem;
  font-size: 2rem;
  text-align: start;
}

th {
  padding: 0 0.5rem;
}

td {
  font-weight: normal;
}

tbody {
  & > tr {
    border-top: 1px solid var(--border-color);
  }
}

.table_headers {
  background-color: rgba(60, 100, 140, 0.62);
  height: 3rem;
}

.table_key {
  padding: 0.8rem 0.4rem;
}

.nested_table {
  border: none;
}

.delete_row {
  cursor: pointer;
  padding: 0.8rem 0.6rem;
}

.collapse_arrow {
  transition: 0.2s ease transform;
  cursor: pointer;
  padding: 0.6rem;
  height: fit-content;

  &.collapsed {
    transform: rotate(90deg);
  }
}
</style>