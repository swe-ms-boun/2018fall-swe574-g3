import Vue from 'vue';
import Router from 'vue-router';
import LivingMemory from './components/LivingMemory.vue';
import Profile from './components/Profile.vue';

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
}];

const router = new Router({
  mode: 'history',
  base: __dirname,
  routes,
});

export default router;
