import { api } from '../js/api.js';

export default {
  data() {
    return {
      summary: {},
      items: [],
      movements: [],
      loading: true,
      error: '',
    };
  },
  computed: {
    lowStockItems() {
      return this.items.filter((item) => Number(item.stock) <= Number(item.minimum_stock));
    },
    stats() {
      return [
        { label: 'Total Barang', value: this.summary.total_items ?? 0, color: 'text-slate-950', note: 'Barang terdaftar' },
        { label: 'Kategori', value: this.summary.total_categories ?? 0, color: 'text-teal-700', note: 'Kelompok barang' },
        { label: 'Supplier', value: this.summary.total_suppliers ?? 0, color: 'text-indigo-700', note: 'Pemasok tercatat' },
        { label: 'Stok Menipis', value: this.summary.low_stock_items ?? 0, color: 'text-amber-700', note: 'Butuh perhatian' },
      ];
    },
    totalStock() {
      return this.items.reduce((total, item) => total + Number(item.stock || 0), 0);
    },
    totalAsset() {
      return this.items.reduce((total, item) => total + (Number(item.stock || 0) * Number(item.price || 0)), 0);
    },
    recentMovements() {
      return this.movements.slice(0, 5);
    },
  },
  async mounted() {
    try {
      const [summary, items, movements] = await Promise.all([api.get('/summary'), api.get('/items'), api.get('/stock-movements')]);
      this.summary = summary.data;
      this.items = items.data;
      this.movements = movements.data;
    } catch {
      this.error = 'Data belum bisa dimuat. Pastikan layanan aplikasi dan database sedang berjalan.';
    } finally {
      this.loading = false;
    }
  },
  methods: {
    rupiah(value) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
    },
  },
  template: `
    <section class="grid gap-6">
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-teal-700">Ringkasan Gudang</p>
            <h1 class="mt-1 text-2xl font-black text-slate-950">Dashboard Admin</h1>
            <p class="mt-1 text-sm text-slate-600">Pantau stok, nilai barang, dan aktivitas terbaru hari ini.</p>
          </div>
          <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">Data siap digunakan</span>
        </div>
      </div>

      <p v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{{ error }}</p>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div v-for="stat in stats" :key="stat.label" class="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div class="flex items-center justify-between gap-3">
            <p class="text-sm font-semibold text-slate-500">{{ stat.label }}</p>
            <span class="h-2.5 w-2.5 rounded-full bg-teal-400"></span>
          </div>
          <p :class="['mt-2 text-3xl font-bold', stat.color]">{{ loading ? '...' : stat.value }}</p>
          <p class="mt-1 text-xs font-medium text-slate-400">{{ stat.note }}</p>
        </div>
      </div>

      <div class="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div class="rounded-lg border border-slate-200 bg-slate-950 p-5 text-white shadow-soft">
          <p class="text-sm font-semibold text-slate-300">Total stok tersedia</p>
          <p class="mt-2 text-4xl font-black">{{ loading ? '...' : totalStock }}</p>
          <p class="mt-1 text-sm text-slate-400">Akumulasi seluruh barang di gudang</p>
          <div class="mt-5 rounded-lg bg-white/10 p-4">
            <p class="text-xs font-semibold uppercase tracking-wider text-teal-200">Estimasi nilai persediaan</p>
            <p class="mt-1 text-xl font-bold">{{ rupiah(totalAsset) }}</p>
          </div>
        </div>

        <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 class="font-bold text-slate-950">Aktivitas Stok Terbaru</h2>
              <p class="mt-1 text-xs text-slate-500">Riwayat barang masuk dan keluar terakhir.</p>
            </div>
            <router-link to="/mutasi" class="rounded-md border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">Lihat Semua</router-link>
          </div>
          <div class="mt-4 grid gap-3">
            <div v-for="movement in recentMovements" :key="movement.id" class="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div>
                <p class="text-sm font-bold text-slate-900">{{ movement.item_name }}</p>
                <p class="text-xs text-slate-500">{{ movement.movement_date }} • {{ movement.sku }}</p>
              </div>
              <span :class="movement.type === 'in' ? 'rounded-full bg-teal-100 px-2.5 py-1 text-xs font-bold text-teal-800' : 'rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-800'">
                {{ movement.type === 'in' ? '+' : '-' }}{{ movement.quantity }}
              </span>
            </div>
            <p v-if="!recentMovements.length" class="rounded-lg border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">Belum ada aktivitas stok.</p>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-slate-200 bg-white shadow-soft">
        <div class="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 class="font-bold text-slate-950">Barang Stok Menipis</h2>
            <p class="mt-1 text-xs text-slate-500">Daftar item yang sudah menyentuh batas minimum.</p>
          </div>
          <router-link to="/barang" class="rounded-md border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">Kelola Barang</router-link>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th class="px-5 py-3">SKU</th>
                <th class="px-5 py-3">Nama</th>
                <th class="px-5 py-3">Kategori</th>
                <th class="px-5 py-3">Stok</th>
                <th class="px-5 py-3">Minimum</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="item in lowStockItems" :key="item.id" class="hover:bg-slate-50">
                <td class="px-5 py-3 font-medium">{{ item.sku }}</td>
                <td class="px-5 py-3">{{ item.name }}</td>
                <td class="px-5 py-3">{{ item.category_name }}</td>
                <td class="px-5 py-3 font-bold text-amber-700">{{ item.stock }}</td>
                <td class="px-5 py-3">{{ item.minimum_stock }}</td>
              </tr>
              <tr v-if="!lowStockItems.length">
                <td colspan="5" class="px-5 py-10 text-center">
                  <p class="font-semibold text-slate-700">Stok aman</p>
                  <p class="mt-1 text-sm text-slate-500">Tidak ada barang di bawah stok minimum.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `,
};
