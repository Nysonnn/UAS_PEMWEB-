<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateItems extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'category_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
            'supplier_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
            'sku' => ['type' => 'VARCHAR', 'constraint' => 40, 'unique' => true],
            'name' => ['type' => 'VARCHAR', 'constraint' => 160],
            'unit' => ['type' => 'VARCHAR', 'constraint' => 30, 'default' => 'pcs'],
            'stock' => ['type' => 'INT', 'constraint' => 11, 'default' => 0],
            'minimum_stock' => ['type' => 'INT', 'constraint' => 11, 'default' => 0],
            'price' => ['type' => 'DECIMAL', 'constraint' => '12,2', 'default' => 0],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('category_id', 'categories', 'id', 'CASCADE', 'RESTRICT');
        $this->forge->addForeignKey('supplier_id', 'suppliers', 'id', 'CASCADE', 'RESTRICT');
        $this->forge->createTable('items');
    }

    public function down()
    {
        $this->forge->dropTable('items');
    }
}
