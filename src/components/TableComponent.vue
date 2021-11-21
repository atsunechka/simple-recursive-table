<template>
  <div :class="$style.child_table">
    <div :class=$style.child_title v-text="tableName"/>
    <template v-if="tableData?.length">
      <div :class=$style.table_headers>
        <div :class=$style.table_header v-for="(headerName, key) in tableHeaders" v-text="headerName" :key="key"/>
      </div>
      <div>
        <div :class="$style.row_wrapper" v-for="({ data, kids, id }, index) in tableData" :key="index">
          <div :class="$style.table_row">
            <div  v-for="(rowData, keyName) in data"
                  :key="keyName"
                  :class="$style.table_key"
                  v-text="rowData"
            />
            <div :class="$style.delete_row" v-text="`X`" @click="deleteRow(id)"/>
          </div>
          <div :class="$style.nested_table" v-for="(_, childKey) in kids" :key="childKey">
            <template v-if="getRowKids(kids, childKey).length" >
              <div :class="[$style.collapse_arrow, hasCollapsedTable(kids[childKey].id) && $style.collapsed]"
                   v-text="'>'"
                   @click="toggleTables(kids[childKey].id)"
              />
              <TableComponent
                v-show="!hasCollapsedTable(kids[childKey].id)"
                :tableData="getRowKids(kids, childKey)"
                :injectionProp="injectionProp"
                :tableName="childKey"/>
            </template>
          </div>
        </div>
      </div>
    </template>

  </div>
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
      const { toggleTables, hasCollapsedTable, deleteRow } = props.injectionProp!();


      const tableHeaders = computed(() => {
        if (!props.tableData?.length)
          return [];

        return  Object.keys(props.tableData[0].data);
      })

      const getRowKids = (kids: KidRecords, childKey: keyof typeof kids) =>
        kids[childKey]?.records || []

      return {
        toggleTables,
        hasCollapsedTable,
        deleteRow,
        tableHeaders,
        getRowKids
      }
    }
  })
</script>

<style lang="scss" module>
:root {
  --border-color: #212020;
}

.child_table {
  margin-left: 1rem;
  margin-top: 0.25rem;
  border: 1px solid var(--border-color);
}

.child_title {
  padding-left: 1rem;
  font-size: 2rem;
  text-align: start;
}

.table_headers {
  display: flex;
  align-items: center;
  background-color: rgba(44, 62, 80, 0.62);
  padding: 0.6rem 0;
}
.table_header {
  padding: 0 0.4rem;

  & + .table_header {
    border-left: 1px solid var(--border-color);
  }
}

.table_row {
  display: flex;
  align-items: center;
}

.table_key {
  padding: 0.8rem 0.4rem;

  & + .table_key {
    border-left: 1px solid var(--border-color);
  }
}

.row_wrapper {
  display: block;

  & + .row_wrapper {
    border-top: 1px solid var(--border-color);
  }
}

.table_row {
  border-top: 1px solid var(--border-color);

  & + .table_row {
    border-top: none;
  }
}

.nested_table {
  margin-top: 0.5rem;
  display: flex;
}

.delete_row {
  margin-left: auto;
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