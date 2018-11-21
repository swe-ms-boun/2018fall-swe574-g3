<template>
  <div id="app">
     <!-- As a heading -->
    <b-navbar class="navbar border border-dark border-top-0">
        <img src="./assets/logo.png" class="logo" alt="Beaver">
        <img src="./assets/logo_text.png" class="logo_text" alt="Beaver">
        <div class="links">
          <router-link to="/">Home</router-link> |
          <router-link to="/profile">Profile</router-link> |
          <router-link to="/login">Log In</router-link>
        </div>
    </b-navbar>
    <router-view/>
  </div>
</template>

<style scoped>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#navbar {
  padding: 30px;
}

.links a {
  font-weight: bold;
  color: #2c3e50;
}

.links a.router-link-exact-active {
  color: #42b983;
}


h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.navbar {
  background: linear-gradient(to right,#ffffff , #ffffff);
  height: 64px;
  text-align: left;
}

.links {
  text-align: right !important;
  display: block;
  align-self: right;
}

img.logo {
  height: 64px !important;
  align-items: left;
  justify-content: left;
}

img.logo_text {
  height: 64px !important;
  align-items: left;
  justify-content: left;
}
</style>
