import { api, getErrorMessage } from '../js/api.js';

export default {
  data() {
    return {
      rows: [],
      loading: false,
      search: '',
      modalOpen: false,
      editingId: null,
      error: '',
      form: { name: '', phone: '', address: '' },
    };
  },
  async mounted() {
    await this.load();
  },
  computed: {
    filteredRows() {
      const keyword = this.search.toLowerCase().trim();
      if (!keyword) return this.rows;
      return this.rows.filter((row) => [row.name, row.phone, row.address].join(' ').toLowerCase().includes(keyword));
    },
  },
  methods: {
    async load() {
      this.loading = true;
      try {
        const { data } = await api.get('/suppliers');
        this.rows = data;
      } finally {
        this.loading = false;
      }
    },
    openCreate() {
      this.editingId = null;
      this.form = { name: '', phone: '', address: '' };
      this.error = '';
      this.modalOpen = true;
    },
    openEdit(row) {
      this.editingId = row.id;
      this.form = { name: row.name, phone: row.phone || '', address: row.address || '' };
      this.error = '';
      this.modalOpen = true;
    },
    async save() {
      try {
        if (this.editingId) {
          await api.put(`/suppliers/${this.editingId}`, this.form);
        } else {
          await api.post('/suppliers', this.form);
        }
        this.modalOpen = false;
        await this.load();
      } catch (error) {
        this.error = getErrorMessage(error);
      }
    },
    async remove(row) {
      if (!confirm(`Hapus supplier ${row.name}?`)) return;
      await api.delete(`/suppliers/${row.id}`);
      await this.load();
    },
  },
  template: `
    <section class="grid gap-5">
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-indigo-700">Data Pemasok</p>
            <h1 class="mt-1 text-2xl font-black text-slate-950">Supplier</h1>
            <p class="mt-1 text-sm text-slate-600">Data pemasok barang yang terhubung ke master barang.</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <input v-model="search" placeholder="Cari supplier..." class="w-52 rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100" />
            <button @click="openCreate" class="rounded-md bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-soft hover:bg-slate-800">Tambah Supplier</button>
          </div>
        </div>
      </div>

      <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
        <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th class="px-5 py-3">Nama</th>
              <th class="px-5 py-3">Telepon</th>
              <th class="px-5 py-3">Alamat</th>
              <th class="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="loading">
              <td colspan="4" class="px-5 py-10 text-center text-slate-500">Memuat data supplier...</td>
            </tr>
            <tr v-for="row in filteredRows" :key="row.id" class="hover:bg-slate-50">
              <td class="px-5 py-3 font-medium">{{ row.name }}</td>
              <td class="px-5 py-3">{{ row.phone || '-' }}</td>
              <td class="px-5 py-3 text-slate-600">{{ row.address || '-' }}</td>
              <td class="px-5 py-3 text-right">
                <button @click="openEdit(row)" class="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold hover:bg-slate-50">Edit</button>
                <button @click="remove(row)" class="ml-2 rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50">Hapus</button>
              </td>
            </tr>
            <tr v-if="!loading && !filteredRows.length">
              <td colspan="4" class="px-5 py-10 text-center text-slate-500">Belum ada supplier.</td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>

      <div v-if="modalOpen" class="fixed inset-0 z-40 grid place-items-center bg-slate-950/40 p-4">
        <form @submit.prevent="save" class="w-full max-w-lg rounded-lg bg-white shadow-2xl">
          <div class="border-b border-slate-200 px-6 py-4">
            <h2 class="text-lg font-bold text-slate-950">{{ editingId ? 'Edit Supplier' : 'Tambah Supplier' }}</h2>
            <p class="mt-1 text-sm text-slate-500">Simpan kontak pemasok agar mudah dipilih pada data barang.</p>
          </div>
          <div class="grid gap-4 p-6">
            <div>
              <label class="text-sm font-semibold text-slate-700">Nama</label>
              <input v-model="form.name" class="mt-1.5 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100" required />
            </div>
            <div>
              <label class="text-sm font-semibold text-slate-700">Telepon</label>
              <input v-model="form.phone" class="mt-1.5 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100" />
            </div>
            <div>
              <label class="text-sm font-semibold text-slate-700">Alamat</label>
              <textarea v-model="form.address" rows="3" class="mt-1.5 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"></textarea>
            </div>
            <p v-if="error" class="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{{ error }}</p>
            <div class="flex justify-end gap-2">
              <button type="button" @click="modalOpen = false" class="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50">Batal</button>
              <button class="rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">Simpan</button>
            </div>
          </div>
        </form>
      </div>
    </section>
  `,
};
