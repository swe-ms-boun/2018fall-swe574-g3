<template>
  <div class="Login">
      <div v-if="!fbname">
           <fb-signin-button
    :params="fbSignInParams"
    @success="onSignInSuccess"
    @error="onSignInError">
    Sign in with Facebook
  </fb-signin-button>
      </div>
      <div class="Login" v-else>
          <h3>Good to see you, {{this.$session.get('session_username')}}.</h3>
      </div>
  </div>
</template>

<script>
import FBSignInButton from 'vue-facebook-signin-button';
import Vue from 'vue';
import VueSession from 'vue-session';

Vue.use(FBSignInButton);
Vue.use(VueSession)

export default {
  name: "Profile",
  // Variables here
  data() {
    return {
      fbname: false,
      fbSignInParams: {
        scope: "email",
        return_scopes: true
      }
    };
  },

  // Setters here
  watch: {
    /* eslint-disable */
    filteredMemories: function() {}
  },

  // On Create here
  async created() {
    window.fbAsyncInit = function() {
      FB.init({
        appId: "2108990302700413",
        cookie: true, // enable cookies to allow the server to access the session
        xfbml: true, // parse social plugins on this page
        version: "v2.8" // use graph api version 2.8
      });
    };
    (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  },

  // Methods here
  methods: {
    onSignInSuccess(response) {
      FB.api("/me", dude => {
        console.log(`Good to see you, ${dude.name}.`);
        this.fbname = dude.name;
        console.log(this.fbname);
        this.$session.start();
        this.$session.set('session_username',this.fbname);
        console.log(this.$session.getAll());
        this.fbname =true;
      });
    },
    onSignInError(error) {
      console.log("OH NOES", error);
    }
    /*  fillMemories(exampleMemories) {
    this.memories = exampleMemories */
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#Login {
  margin: 100px;
  display: grid;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  grid-template:
    ". Login ." auto
    / 13% 1fr 13%;
}
.fb-signin-button {
  /* This is where you control how the button looks. Be creative! */
  display: inline-block;
  margin: 100px;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #4267b2;
  color: #fff;
}

</style>
