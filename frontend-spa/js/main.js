import { router } from './router.js';

const App = {
  data() {
    return {
      authState: {
        isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
        user: JSON.parse(localStorage.getItem('user') || '{}'),
      },
    };
  },
  computed: {
    isLoggedIn() {
      return this.authState.isLoggedIn;
    },
    user() {
      return this.authState.user;
    },
    navItems() {
      return [
        { label: 'Dashboard', to: '/dashboard', icon: '01' },
        { label: 'Barang', to: '/barang', icon: '02' },
        { label: 'Kategori', to: '/kategori', icon: '03' },
        { label: 'Supplier', to: '/supplier', icon: '04' },
        { label: 'Mutasi Stok', to: '/mutasi', icon: '05' },
      ];
    },
  },
  methods: {
    refreshAuth() {
      this.authState = {
        isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
        user: JSON.parse(localStorage.getItem('user') || '{}'),
      };
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      this.refreshAuth();
      this.$router.push('/login');
    },
  },
  mounted() {
    window.addEventListener('auth-changed', this.refreshAuth);
    this.refreshAuth();
  },
  beforeUnmount() {
    window.removeEventListener('auth-changed', this.refreshAuth);
  },
  template: `
    <div class="min-h-screen bg-[radial-gradient(circle_at_top_left,#d9f99d_0,#f1f5f9_28%,#eef2ff_100%)]">
      <header class="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <router-link to="/" class="flex items-center gap-3">
            <span class="grid h-10 w-10 place-items-center rounded-lg bg-slate-950 text-sm font-black text-white shadow-soft">EI</span>
            <span>
              <span class="block text-base font-bold leading-5 text-slate-950">E-Inventory</span>
              <span class="block text-xs font-medium text-slate-500">Gudang & stok barang</span>
            </span>
          </router-link>
          <div class="flex items-center gap-3">
            <div v-if="isLoggedIn" class="hidden items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 sm:flex">
              <span class="grid h-7 w-7 place-items-center rounded-full bg-teal-600 text-xs font-bold text-white">{{ (user.name || 'A').charAt(0) }}</span>
              <span class="text-sm font-semibold text-slate-700">{{ user.name }}</span>
            </div>
            <router-link v-if="!isLoggedIn" to="/login" class="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-slate-800">Login Admin</router-link>
            <button v-else @click="logout" class="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Logout</button>
          </div>
        </div>
      </header>

      <div class="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_1fr]">
        <aside v-if="isLoggedIn" class="self-start rounded-lg border border-slate-200 bg-white/95 p-3 shadow-soft lg:sticky lg:top-20 lg:min-h-[calc(100vh-104px)]">
          <div class="mb-4 rounded-lg bg-slate-950 p-4 text-white">
            <p class="text-xs font-semibold uppercase tracking-wider text-teal-200">Panel Admin</p>
            <p class="mt-1 text-sm text-slate-300">Kelola stok, master data, dan histori mutasi.</p>
          </div>
          <nav class="grid gap-1.5">
            <router-link v-for="item in navItems" :key="item.to" :to="item.to" class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950" active-class="bg-teal-50 text-teal-900 ring-1 ring-teal-100">
              <span class="grid h-8 w-8 place-items-center rounded-md bg-slate-100 text-[11px] font-bold text-slate-500">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </router-link>
          </nav>
        </aside>
        <main :class="isLoggedIn ? '' : 'lg:col-span-2'">
          <router-view />
        </main>
      </div>
    </div>
  `,
};

window.Vue.createApp(App).use(router).mount('#app');
