<template>
  <b-row class='mt-5'>
    <AdminPanelComponent :tableItems='tableItems'/>
  </b-row>
</template>

<script>
import axios from 'axios';
import serverUrl from '@/config';
import store from '@/Store';
import AdminPanelComponent from '@/components/AdminPanelComponent';

export default {
  name: 'AdminPanel',
  components: {
    AdminPanelComponent
  },
  data() {
    return {
      tableItems: []
    }
  },
  created() {
    if (store.state.userInfo.role !== 1) {
      this.$router.push('/')
    }
    axios.get(`${serverUrl}/api/user/list`)
      .then(response => {
        this.dataToTable(response);
      });
  },
  methods: {
    dataToTable(array) {
      let result = [];
      array.data.forEach(user => {
        result.push({Id: user.user_id, Name: user.user_name, Email: user.user_email, Role: user.role_name, Status: user.status});
      });
      this.tableItems = result;
    }
  },
  computed: {
  }
}
</script>

<style>

</style>