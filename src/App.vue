<template>
  <div class="app">
    <h1 v-text="'My table component'"/>
    <input type="file" accept="application/json" ref="fileRef" @change="getFile">
    <div class="table-data">
      <TableComponent v-if="tableData"
                      :injectionProp="injectTableState"
                      @toggle="toggleTables"
                      :tableData="tableData"
                      :tableName="tableName"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import TableComponent from '@/components/TableComponent.vue';
import { injectTableState, provideTableState } from '@/components/tableComponent.provider';

export default defineComponent({
  name: 'App',
  components: {
    TableComponent
  },
  setup() {
    const fileRef = ref();
    const tableState = provideTableState();

    const tableName = ref();

    const getFile = () => {
      const reader = new FileReader()
      tableName.value = fileRef.value.files![0].name;

      reader.onload = (event) => {
        tableState.setTableData(JSON.parse(event.target?.result as string));
      }

      reader.readAsText(fileRef.value.files![0])
    }

    return {
      ...tableState,
      injectTableState,
      tableName,
      getFile,
      fileRef
    }
  }
});

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
