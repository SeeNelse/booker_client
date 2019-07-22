<template>
  <b-table striped hover v-if='usersList.length' :items='usersList' :fields="fields">
    
    <template slot="Block?" slot-scope="row">
      <b-button 
        variant="info" 
        @click='blockUser(row.item.Id, row.item.Role, row.item.Status)'
      >{{row.item.Status === 'active' ? 'Block!' : 'Unblock!'}}</b-button>
    </template>
  
  </b-table>
</template>

<script>
import store from '@/Store';
import serverUrl from '@/config';
import axios from 'axios';

export default {
  name: 'AdminPanelComponent',
  props: ['tableItems', 'getUsersList'],
  data() {
    return {
      fields: ['Id', 'Name', 'Email', 'Role', 'Status', 'Block?'],
    }
  },
  methods: {
    blockUser(id, userRole, status) {
      if (userRole !== 'admin') {
        const eventDataForDB = JSON.stringify({id, userRole, adminRole: store.state.userInfo.role, status: status});
        axios.post(`${serverUrl}/api/user/block`, eventDataForDB)
        .then((response) => {
          if (response.status === 200) {
            this.getUsersList()
          }
        })

      } else {
        this.errorIsAdmin();
      }
    },
    errorIsAdmin() {
      this.$bvToast.toast(':(', {
        title: `This is Admin!`,
        variant: 'info',
        solid: true,
        toaster: 'b-toaster-bottom-left'
      })
    },
  },
  computed: {
    usersList() {
      return this.tableItems;
    },
    userInfo: {
      get () {
        return store.state.userInfo
      },
    },
  }
}
</script>

<style>

</style>
