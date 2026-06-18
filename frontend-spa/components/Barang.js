import { api, getErrorMessage } from '../js/api.js';

export default {
  data() {
    return {
      rows: [],
      categories: [],
      suppliers: [],
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
        row.sku,
        row.name,
        row.category_name,
        row.supplier_name,
        row.unit,
      ].join(' ').toLowerCase().includes(keyword));
    },
  },
  methods: {
    emptyForm() {
      return {
        category_id: '',
        supplier_id: '',
        sku: '',
        name: '',
        unit: 'pcs',
        stock: 0,
        minimum_stock: 1,
        price: 0,
      };
    },
    async load() {
      this.loading = true;
      try {
        const [items, categories, suppliers] = await Promise.all([
          api.get('/items'),
          api.get('/categories'),
          api.get('/suppliers'),
        ]);
        this.rows = items.data;
        this.categories = categories.data;
        this.suppliers = suppliers.data;
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
        category_id: row.category_id,
        supplier_id: row.supplier_id,
        sku: row.sku,
        name: row.name,
        unit: row.unit,
        stock: row.stock,
        minimum_stock: row.minimum_stock,
        price: row.price,
      };
      this.error = '';
      this.modalOpen = true;
    },
    async save() {
      try {
        if (this.editingId) {
          await api.put(`/items/${this.editingId}`, this.form);
        } else {
          await api.post('/items', this.form);
        }
        this.modalOpen = false;
        await this.load();
      } catch (error) {
        this.error = getErrorMessage(error);
      }
    },
    async remove(row) {
      if (!confirm(`Hapus barang ${row.name}?`)) return;
      await api.delete(`/items/${row.id}`);
      await this.load();
    },
    rupiah(value) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
    },
  },
  template: `
    <section class="grid gap-5">
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-teal-700">Daftar Persediaan</p>
            <h1 class="mt-1 text-2xl font-black text-slate-950">Data Barang</h1>
            <p class="mt-1 text-sm text-slate-600">Master barang terhubung dengan kategori dan supplier.</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <input v-model="search" placeholder="Cari barang..." class="w-52 rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100" />
            <button @click="openCreate" class="rounded-md bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-soft hover:bg-slate-800">Tambah Barang</button>
          </div>
        </div>
      </div>

      <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th class="px-5 py-3">SKU</th>
                <th class="px-5 py-3">Barang</th>
                <th class="px-5 py-3">Kategori</th>
                <th class="px-5 py-3">Supplier</th>
                <th class="px-5 py-3">Stok</th>
                <th class="px-5 py-3">Harga</th>
                <th class="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="loading">
                <td colspan="7" class="px-5 py-10 text-center text-slate-500">Memuat data barang...</td>
              </tr>
              <tr v-for="row in filteredRows" :key="row.id" class="hover:bg-slate-50">
                <td class="px-5 py-3 font-medium">{{ row.sku }}</td>
                <td class="px-5 py-3">
                  <p class="font-semibold text-slate-900">{{ row.name }}</p>
                  <p class="text-xs text-slate-500">Min. {{ row.minimum_stock }} {{ row.unit }}</p>
                </td>
                <td class="px-5 py-3">{{ row.category_name }}</td>
                <td class="px-5 py-3">{{ row.supplier_name }}</td>
                <td class="px-5 py-3">
                  <span :class="Number(row.stock) <= Number(row.minimum_stock) ? 'rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800' : 'rounded-full bg-teal-100 px-2.5 py-1 text-xs font-bold text-teal-800'">
                    {{ row.stock }} {{ row.unit }}
                  </span>
                </td>
                <td class="px-5 py-3">{{ rupiah(row.price) }}</td>
                <td class="px-5 py-3 text-right">
                  <button @click="openEdit(row)" class="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold hover:bg-slate-50">Edit</button>
                  <button @click="remove(row)" class="ml-2 rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50">Hapus</button>
                </td>
              </tr>
              <tr v-if="!loading && !filteredRows.length">
                <td colspan="7" class="px-5 py-10 text-center text-slate-500">Belum ada data barang.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="modalOpen" class="fixed inset-0 z-40 grid place-items-center bg-slate-950/40 p-4">
        <form @submit.prevent="save" class="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-2xl">
          <div class="border-b border-slate-200 px-6 py-4">
            <h2 class="text-lg font-bold text-slate-950">{{ editingId ? 'Edit Barang' : 'Tambah Barang' }}</h2>
            <p class="mt-1 text-sm text-slate-500">Lengkapi identitas, relasi kategori/supplier, harga, dan batas stok.</p>
          </div>
          <div class="grid gap-4 p-6 sm:grid-cols-2">
            <div>
              <label class="text-sm font-semibold text-slate-700">Kategori</label>
              <select v-model="form.category_id" class="mt-1.5 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100" required>
                <option value="">Pilih kategori</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-semibold text-slate-700">Supplier</label>
              <select v-model="form.supplier_id" class="mt-1.5 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100" required>
                <option value="">Pilih supplier</option>
                <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">{{ supplier.name }}</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-semibold text-slate-700">SKU</label>
              <input v-model="form.sku" class="mt-1.5 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm uppercase focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100" required />
            </div>
            <div>
              <label class="text-sm font-semibold text-slate-700">Nama Barang</label>
              <input v-model="form.name" class="mt-1.5 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100" required />
            </div>
            <div>
              <label class="text-sm font-semibold text-slate-700">Satuan</label>
              <input v-model="form.unit" class="mt-1.5 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100" required />
            </div>
            <div>
              <label class="text-sm font-semibold text-slate-700">Harga</label>
              <input v-model.number="form.price" type="number" min="0" class="mt-1.5 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100" required />
            </div>
            <div>
              <label class="text-sm font-semibold text-slate-700">Stok</label>
              <input v-model.number="form.stock" type="number" min="0" class="mt-1.5 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100" required />
            </div>
            <div>
              <label class="text-sm font-semibold text-slate-700">Stok Minimum</label>
              <input v-model.number="form.minimum_stock" type="number" min="0" class="mt-1.5 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100" required />
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
