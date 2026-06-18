import { api, getErrorMessage } from '../js/api.js';

export default {
  data() {
    return {
      rows: [],
      items: [],
      loading: false,
      search: '',
      modalOpen: false,
      editingId: null,
      error: '',
      form: this.emptyForm(),
    };
  },
  async mounted() {
    await this.load();
  },
  computed: {
    filteredRows() {
      const keyword = this.search.toLowerCase().trim();
      if (!keyword) return this.rows;
      return this.rows.filter((row) => [
        row.movement_date,
        row.sku,
        row.item_name,
        row.type === 'in' ? 'masuk' : 'keluar',
        row.notes,
      ].join(' ').toLowerCase().includes(keyword));
    },
  },
  methods: {
    emptyForm() {
      return {
        item_id: '',
        type: 'in',
        quantity: 1,
        movement_date: new Date().toISOString().slice(0, 10),
        notes: '',
      };
    },
    async load() {
      this.loading = true;
      try {
        const [movements, items] = await Promise.all([api.get('/stock-movements'), api.get('/items')]);
        this.rows = movements.data;
        this.items = items.data;
      } finally {
        this.loading = false;
      }
    },
    openCreate() {
      this.editingId = null;
      this.form = this.emptyForm();
      this.error = '';
      this.modalOpen = true;
    },
    openEdit(row) {
      this.editingId = row.id;
      this.form = {
        item_id: row.item_id,
        type: row.type,
        quantity: row.quantity,
        movement_date: row.movement_date,
        notes: row.notes || '',
      };
      this.error = '';
      this.modalOpen = true;
    },
    async save() {
      try {
        if (this.editingId) {
          await api.put(`/stock-movements/${this.editingId}`, this.form);
        } else {
          await api.post('/stock-movements', this.form);
        }
        this.modalOpen = false;
        await this.load();
      } catch (error) {
        this.error = getErrorMessage(error);
      }
    },
    async remove(row) {
      if (!confirm(`Hapus histori ${row.sku} tanggal ${row.movement_date}?`)) return;
      await api.delete(`/stock-movements/${row.id}`);
      await this.load();
    },
  },
  template: `
    <section class="grid gap-5">
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-amber-700">Riwayat Stok</p>
            <h1 class="mt-1 text-2xl font-black text-slate-950">Histori Barang Masuk/Keluar</h1>
            <p class="mt-1 text-sm text-slate-600">Catatan transaksi stok dan perubahan jumlah barang.</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <input v-model="search" placeholder="Cari histori..." class="w-52 rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100" />
            <button @click="openCreate" class="rounded-md bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-soft hover:bg-slate-800">Tambah Mutasi</button>
          </div>
        </div>
      </div>

      <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th class="px-5 py-3">Tanggal</th>
                <th class="px-5 py-3">SKU</th>
                <th class="px-5 py-3">Barang</th>
                <th class="px-5 py-3">Tipe</th>
                <th class="px-5 py-3">Jumlah</th>
                <th class="px-5 py-3">Catatan</th>
                <th class="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="loading">
                <td colspan="7" class="px-5 py-10 text-center text-slate-500">Memuat histori stok...</td>
              </tr>
              <tr v-for="row in filteredRows" :key="row.id" class="hover:bg-slate-50">
                <td class="px-5 py-3">{{ row.movement_date }}</td>
                <td class="px-5 py-3 font-medium">{{ row.sku }}</td>
                <td class="px-5 py-3 font-semibold text-slate-900">{{ row.item_name }}</td>
                <td class="px-5 py-3">
                  <span :class="row.type === 'in' ? 'rounded-full bg-teal-100 px-2.5 py-1 text-xs font-bold text-teal-800' : 'rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-800'">
                    {{ row.type === 'in' ? 'Masuk' : 'Keluar' }}
                  </span>
                </td>
                <td class="px-5 py-3 font-bold">{{ row.quantity }}</td>
                <td class="px-5 py-3 text-slate-600">{{ row.notes || '-' }}</td>
                <td class="px-5 py-3 text-right">
                  <button @click="openEdit(row)" class="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold hover:bg-slate-50">Edit</button>
                  <button @click="remove(row)" class="ml-2 rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50">Hapus</button>
                </td>
              </tr>
              <tr v-if="!loading && !filteredRows.length">
                <td colspan="7" class="px-5 py-10 text-center text-slate-500">Belum ada histori stok.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="modalOpen" class="fixed inset-0 z-40 grid place-items-center bg-slate-950/40 p-4">
        <form @submit.prevent="save" class="w-full max-w-2xl rounded-lg bg-white shadow-2xl">
          <div class="border-b border-slate-200 px-6 py-4">
            <h2 class="text-lg font-bold text-slate-950">{{ editingId ? 'Edit Mutasi Stok' : 'Tambah Mutasi Stok' }}</h2>
            <p class="mt-1 text-sm text-slate-500">Catat barang masuk atau keluar agar stok otomatis berubah.</p>
          </div>
          <div class="grid gap-4 p-6 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label class="text-sm font-semibold text-slate-700">Barang</label>
              <select v-model="form.item_id" class="mt-1.5 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100" required>
                <option value="">Pilih barang</option>
                <option v-for="item in items" :key="item.id" :value="item.id">{{ item.sku }} - {{ item.name }} (stok: {{ item.stock }})</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-semibold text-slate-700">Tipe</label>
              <select v-model="form.type" class="mt-1.5 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100" required>
                <option value="in">Barang Masuk</option>
                <option value="out">Barang Keluar</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-semibold text-slate-700">Jumlah</label>
              <input v-model.number="form.quantity" type="number" min="1" class="mt-1.5 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100" required />
            </div>
            <div>
              <label class="text-sm font-semibold text-slate-700">Tanggal</label>
              <input v-model="form.movement_date" type="date" class="mt-1.5 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100" required />
            </div>
            <div>
              <label class="text-sm font-semibold text-slate-700">Catatan</label>
              <input v-model="form.notes" class="mt-1.5 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100" />
            </div>
            <p v-if="error" class="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 sm:col-span-2">{{ error }}</p>
            <div class="flex justify-end gap-2 sm:col-span-2">
              <button type="button" @click="modalOpen = false" class="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50">Batal</button>
              <button class="rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">Simpan</button>
            </div>
          </div>
        </form>
      </div>
    </section>
  `,
};
