import Vue from 'vue';
import Router from 'vue-router';
import LivingMemory from './components/LivingMemory.vue';

Vue.use(Router);

const routes = [{
  path: '/',
  name: 'LivingMemory',
  component: LivingMemory,
}];

const router = new Router({
  mode: 'history',
  base: __dirname,
  routes,
});

export default router;
