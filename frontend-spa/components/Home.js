import { api } from '../js/api.js';

export default {
  data() {
    return {
      summary: null,
      loading: true,
    };
  },
  async mounted() {
    try {
      const { data } = await api.get('/summary');
      this.summary = data;
    } catch {
      this.summary = null;
    } finally {
      this.loading = false;
    }
  },
  template: `
    <section class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
      <div class="grid gap-8 p-6 md:grid-cols-[1.08fr_0.92fr] md:p-10">
        <div>
          <p class="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-700 ring-1 ring-teal-100">Manajemen Inventaris</p>
          <h1 class="mt-4 max-w-2xl text-4xl font-black leading-tight text-slate-950 md:text-5xl">Pantau stok barang tanpa ribet</h1>
          <p class="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            E-Inventory membantu admin gudang mencatat barang, supplier, stok tersedia, dan riwayat barang masuk atau keluar dengan tampilan yang ringkas.
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <router-link to="/login" class="rounded-md bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-slate-800">Masuk ke Aplikasi</router-link>
            <router-link to="/dashboard" class="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Lihat Dashboard</router-link>
          </div>
          <div class="mt-8 grid gap-3 sm:grid-cols-3">
            <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Pantau</p>
              <p class="mt-1 text-sm font-bold text-slate-900">Stok barang</p>
            </div>
            <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Kelola</p>
              <p class="mt-1 text-sm font-bold text-slate-900">Supplier & kategori</p>
            </div>
            <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Catat</p>
              <p class="mt-1 text-sm font-bold text-slate-900">Barang masuk/keluar</p>
            </div>
          </div>
        </div>
        <div class="grid gap-3">
          <div class="rounded-lg bg-slate-950 p-5 text-white shadow-soft">
            <div class="flex items-start justify-between gap-4">
              <div>
            <p class="text-sm text-slate-300">Ringkasan persediaan</p>
                <p class="mt-2 text-4xl font-black">{{ loading ? '...' : (summary?.total_items ?? 0) }}</p>
              </div>
              <span class="rounded-full bg-teal-400/15 px-3 py-1 text-xs font-bold text-teal-200">Terkini</span>
            </div>
            <p class="text-sm text-slate-300">Total barang tercatat</p>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p class="text-2xl font-bold text-slate-900">{{ summary?.total_categories ?? 0 }}</p>
              <p class="text-sm text-slate-500">Kategori</p>
            </div>
            <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p class="text-2xl font-bold text-slate-900">{{ summary?.total_suppliers ?? 0 }}</p>
              <p class="text-sm text-slate-500">Supplier</p>
            </div>
            <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p class="text-2xl font-bold text-amber-700">{{ summary?.low_stock_items ?? 0 }}</p>
              <p class="text-sm text-slate-500">Stok menipis</p>
            </div>
            <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p class="text-2xl font-bold text-teal-700">{{ (summary?.stock_in ?? 0) - (summary?.stock_out ?? 0) }}</p>
              <p class="text-sm text-slate-500">Selisih stok</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
};
