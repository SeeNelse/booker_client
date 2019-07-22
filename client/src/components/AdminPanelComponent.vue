<template>
  <b-table striped hover :rowItems="rowItems" :fields="fields">
    
    <template slot="Block?" slot-scope="row">
      <b-button variant="info">Block!</b-button>
    </template>

  </b-table>
</template>

<script>
export default {
  name: 'AdminPanelComponent',
  props: ['tableItems'],
  data() {
    return {
      fields: ['Id', 'Name', 'Email', 'Role', 'Status', 'Block?'],
      rowItems: this.tableItems
    }
  },
  created() {

  }
}
</script>

<style>

</style>
