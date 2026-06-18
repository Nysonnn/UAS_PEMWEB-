import { api, getErrorMessage } from '../js/api.js';

export default {
  data() {
    return {
      form: {
        email: 'admin@einventory.test',
        password: 'admin123',
      },
      loading: false,
      error: '',
    };
  },
  methods: {
    async login() {
      this.loading = true;
      this.error = '';
      try {
        const { data } = await api.post('/login', this.form);
        localStorage.setItem('token', data.token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('auth-changed'));
        this.$router.push('/dashboard');
      } catch (error) {
        this.error = getErrorMessage(error);
      } finally {
        this.loading = false;
      }
    },
  },
  template: `
    <section class="mx-auto grid max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft md:grid-cols-[0.95fr_1.05fr]">
      <div class="bg-slate-950 p-8 text-white md:p-10">
        <p class="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-200">Admin Access</p>
        <h1 class="mt-5 text-3xl font-black leading-tight">Masuk ke Panel E-Inventory</h1>
        <p class="mt-4 text-sm leading-6 text-slate-300">Kelola data barang, supplier, kategori, serta mutasi stok dari satu ruang kerja admin yang aman.</p>
        <div class="mt-8 grid gap-3 text-sm">
          <div class="rounded-lg border border-white/10 bg-white/5 p-4">
            <p class="font-semibold text-white">Akun demo</p>
            <p class="mt-1 text-slate-300">admin@einventory.test / admin123</p>
          </div>
          <div class="rounded-lg border border-white/10 bg-white/5 p-4">
            <p class="font-semibold text-white">Akses admin</p>
            <p class="mt-1 text-slate-300">Hanya admin yang bisa menambah, mengubah, dan menghapus data.</p>
          </div>
        </div>
      </div>

      <form class="grid content-center gap-5 p-6 md:p-10" @submit.prevent="login">
        <div>
          <h2 class="text-2xl font-bold text-slate-950">Login Administrator</h2>
          <p class="mt-2 text-sm text-slate-600">Masukkan kredensial admin untuk membuka menu pengelolaan inventaris.</p>
        </div>
        <div>
          <label class="text-sm font-semibold text-slate-700">Email</label>
          <input v-model="form.email" type="email" class="mt-1.5 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100" required />
        </div>
        <div>
          <label class="text-sm font-semibold text-slate-700">Password</label>
          <input v-model="form.password" type="password" class="mt-1.5 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100" required />
        </div>
        <p v-if="error" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{{ error }}</p>
        <button :disabled="loading" class="rounded-md bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-soft hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
          {{ loading ? 'Memproses login...' : 'Login ke Dashboard' }}
        </button>
      </form>
    </section>
  `,
};
