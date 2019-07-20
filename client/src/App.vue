<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-container>
        <b-navbar-brand href="#">Boardroom Booker</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item href="#">Admin panel</b-nav-item>
            <b-nav-item href="#">Link</b-nav-item>
          </b-navbar-nav>

          <b-navbar-nav class="ml-auto">

            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template slot="button-content"><em>User</em></template>
              <b-dropdown-item v-b-modal.sign-up>Sign Up</b-dropdown-item>
              <b-dropdown-item v-b-modal.log-in>Log In</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
    <b-container  class="bv-example-row">
      <router-view/> 
    </b-container>

    <b-modal id="sign-up" title="Sign Up" hide-footer>
      <b-form @submit="signUpSubmit">
        <b-form-group
          id="sign-up-email-group"
          label="Email:"
          label-for="sign-up"
        >
          <b-form-input
            id="sign-up"
            v-model="signUp.email"
            type="email"
            required
            placeholder="Enter email"
            name='email'
          ></b-form-input>
        </b-form-group>
        <b-alert show variant="danger" class='calendar__success' v-if='errors.email'>Incomplete email</b-alert>

        <b-form-group 
          id="sign-up-username-group" 
          label="User name:" 
          label-for="sign-up-username"
          description="Min 4 characters, max 15"
        >
          <b-form-input
            id="sign-up-username"
            v-model="signUp.username"
            type="text"
            required
            placeholder="Enter name"
            name='username'
          ></b-form-input>
        </b-form-group>
        <b-alert show variant="danger" class='calendar__success' v-if='errors.username'>Name does not match</b-alert>

        <b-form-group 
          id="sign-up-pass-group" 
          label="Password:" 
          label-for="sign-up-password"
          description="Min 4 characters, max 20"
        >
          <b-form-input
            id="sign-up-password"
            v-model="signUp.password"
            type="password"
            required
            placeholder="Enter password"
            name='password'
          ></b-form-input>
        </b-form-group>
        <b-alert show variant="danger" class='calendar__success' v-if='errors.password'>The password is incorrect</b-alert>

        <b-button type="submit" variant="info">Sign Up!</b-button>
        <b-alert show variant="success" class='calendar__success' v-if='signUpSuccess'>You have successfully created an account</b-alert>
        <b-alert show variant="danger" class='calendar__success' v-if='errors.alreadyExists'>Account already exists</b-alert>
      </b-form>
    </b-modal>

    <b-modal id="log-in" title="Log In" hide-footer >
      <b-form @submit="logInSubmit">
        <b-form-group
          id="log-in-email-group"
          label="Email:"
          label-for="log-in"
        >
          <b-form-input
            id="log-in"
            v-model="logIn.email"
            type="email"
            required
            placeholder="Enter email"
            name='email'
          ></b-form-input>
        </b-form-group>

        <b-form-group 
          id="log-in-pass-group" 
          label="Password:" 
          label-for="log-in-password"
        >
          <b-form-input
            id="log-in-password"
            v-model="logIn.password"
            type="password"
            required
            placeholder="Enter password"
            name='password'
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="info">Log In!</b-button>
      </b-form>
    </b-modal>

  </div>
</template>

<script>
import axios from 'axios';
import serverUrl from '@/config';

export default {
  name: 'App',
  data() {
    return {
      signUp: {
        email: '',
        username: '',
        password: ''
      },
      logIn: {
        email: '',
        password: ''
      },
      errors: {
        email: false,
        username: false,
        password: false,
        alreadyExists: false
      },
      signUpSuccess: false,
    }
  },
  methods: {
    signUpSubmit(event) {
      event.preventDefault();
      if (!this.signUp.email) {
        this.errors.email = true;
        return false;
      }
      if (this.signUp.username.length < 4 || this.signUp.username.length > 15) {
        this.errors.username = true;
        return false;
      }
      if (this.signUp.password.length < 4 || this.signUp.password.length > 20) {
        this.errors.password = true;
        return false;
      }
      // console.log(this.signUp);
      const signUpToAPI = JSON.stringify(this.signUp);
      axios.post(`${serverUrl}/api/user/signup`, signUpToAPI)
        .then((response) => {
          if (response.status === 200) {
            this.errors.email = false;
            this.errors.username = false;
            this.errors.password = false;
            this.errors.alreadyExists = false;
            
            this.signUpSuccess = true;
            setTimeout(function() {
              this.signUpSuccess = false;
              this.$bvModal.hide('sign-up');
            }.bind(this), 1000);
          }
        })
        .catch((error) => {
          this.errors.alreadyExists = true;
        });
    },
    logInSubmit(event) {
      event.preventDefault();
      console.log(456);
    }
  }
}
</script>

<style>
#app {

}
</style>
