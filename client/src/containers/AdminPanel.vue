<template>
  <b-row class='mt-5'>
    <b-table striped hover :tableItems="tableItems" :fields="fields">
      
      <template slot="Block?" slot-scope="row">
        <b-button variant="info">Block!</b-button>
      </template>

    </b-table>
  </b-row>
</template>

<script>
import axios from 'axios';
import serverUrl from '@/config';

export default {
  name: 'AdminPanel',
  data() {
    return {
      fields: ['Name', 'Id', 'Email', 'Role', 'Status', 'Block?'],
      tableItems: []
    }
  },
  beforeCreate() {
    // axios.get(`${serverUrl}/api/user/list`)
    //   .then(response => {
    //     this.generateItemsForTable(response.data);
    //   });

    axios.get(`${serverUrl}/api/user/list`)
      .then(response => {
        let result = [];
        response.data.forEach(user => {
          result.push({ Name: user.user_name, Id: user.user_id, Email: user.user_email, Role: user.role_name, Status: user.status});
        });
        this.tableItems = result;
        console.log(this.tableItems);
      });
  },
  methods: {
    // generateItemsForTable(usersArray) {
    //   let result = [];
    //   usersArray.forEach(user => {
    //     result.push({ Name: user.user_name, Id: user.user_id, Email: user.user_email, Role: user.role_name, Status: user.status});
    //   });
    //   this.tableItems = result;
    // }
  }
}
</script>

<style>

</style>