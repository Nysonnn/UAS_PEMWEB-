<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class InventorySeeder extends Seeder
{
    public function run()
    {
        $now = date('Y-m-d H:i:s');

        $this->db->disableForeignKeyChecks();
        foreach (['stock_movements', 'items', 'suppliers', 'categories', 'users'] as $table) {
            $this->db->table($table)->truncate();
        }
        $this->db->enableForeignKeyChecks();

        $this->db->table('users')->insert([
            'name' => 'Administrator',
            'email' => 'admin@einventory.test',
            'password_hash' => password_hash('admin123', PASSWORD_DEFAULT),
            'role' => 'admin',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $this->db->table('categories')->insertBatch([
            ['name' => 'Elektronik', 'description' => 'Perangkat kerja kantor', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'ATK', 'description' => 'Alat tulis kantor', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Gudang', 'description' => 'Perlengkapan penyimpanan', 'created_at' => $now, 'updated_at' => $now],
        ]);

        $this->db->table('suppliers')->insertBatch([
            ['name' => 'PT Sumber Makmur', 'phone' => '021-555-1900', 'address' => 'Jakarta', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'CV Mandiri Office', 'phone' => '022-710-8821', 'address' => 'Bandung', 'created_at' => $now, 'updated_at' => $now],
        ]);

        $this->db->table('items')->insertBatch([
            ['category_id' => 1, 'supplier_id' => 1, 'sku' => 'EL-001', 'name' => 'Barcode Scanner', 'unit' => 'unit', 'stock' => 12, 'minimum_stock' => 5, 'price' => 650000, 'created_at' => $now, 'updated_at' => $now],
            ['category_id' => 2, 'supplier_id' => 2, 'sku' => 'ATK-010', 'name' => 'Kertas A4 80gsm', 'unit' => 'rim', 'stock' => 30, 'minimum_stock' => 10, 'price' => 55000, 'created_at' => $now, 'updated_at' => $now],
            ['category_id' => 3, 'supplier_id' => 1, 'sku' => 'GD-007', 'name' => 'Rak Besi 4 Susun', 'unit' => 'unit', 'stock' => 4, 'minimum_stock' => 3, 'price' => 475000, 'created_at' => $now, 'updated_at' => $now],
        ]);

        $this->db->table('stock_movements')->insertBatch([
            ['item_id' => 1, 'type' => 'in', 'quantity' => 12, 'notes' => 'Stok awal', 'movement_date' => date('Y-m-d'), 'created_at' => $now, 'updated_at' => $now],
            ['item_id' => 2, 'type' => 'in', 'quantity' => 30, 'notes' => 'Stok awal', 'movement_date' => date('Y-m-d'), 'created_at' => $now, 'updated_at' => $now],
            ['item_id' => 3, 'type' => 'in', 'quantity' => 4, 'notes' => 'Stok awal', 'movement_date' => date('Y-m-d'), 'created_at' => $now, 'updated_at' => $now],
        ]);
    }
}
