import Vue from 'vue';
import Router from 'vue-router';
import LivingMemory from './components/LivingMemory.vue';
import Profile from './components/Profile.vue';
import Login from './components/Login.vue';

Vue.use(Router);

const routes = [{
  path: '/',
  name: 'LivingMemory',
  component: LivingMemory,
},
{
  path: '/profile',
  name: 'Profile',
  component: Profile,

},
{
  path: '/login',
  name: 'Login',
  component: Login,

}];

const router = new Router({
  mode: 'history',
  base: __dirname,
  routes,
});

export default router;
