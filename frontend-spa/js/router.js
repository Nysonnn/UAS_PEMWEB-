import Home from '../components/Home.js';
import Login from '../components/Login.js';
import Dashboard from '../components/Dashboard.js';
import Barang from '../components/Barang.js';
import Kategori from '../components/Kategori.js';
import Supplier from '../components/Supplier.js';
import Mutasi from '../components/Mutasi.js';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/barang', name: 'barang', component: Barang, meta: { requiresAuth: true } },
  { path: '/kategori', name: 'kategori', component: Kategori, meta: { requiresAuth: true } },
  { path: '/supplier', name: 'supplier', component: Supplier, meta: { requiresAuth: true } },
  { path: '/mutasi', name: 'mutasi', component: Mutasi, meta: { requiresAuth: true } },
];

export const router = window.VueRouter.createRouter({
  history: window.VueRouter.createWebHashHistory(),
  routes,
});

router.beforeEach((to) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: 'login' };
  }
  if (to.name === 'login' && isLoggedIn) {
    return { name: 'dashboard' };
  }
  return true;
});
