<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class DashboardController extends ResourceController
{
    protected $format = 'json';

    public function summary()
    {
        $db = db_connect();

        return $this->respond([
            'total_categories' => $db->table('categories')->countAllResults(),
            'total_suppliers' => $db->table('suppliers')->countAllResults(),
            'total_items' => $db->table('items')->countAllResults(),
            'low_stock_items' => $db->table('items')->where('stock <= minimum_stock', null, false)->countAllResults(),
            'stock_in' => (int) ($db->table('stock_movements')->selectSum('quantity')->where('type', 'in')->get()->getRow('quantity') ?? 0),
            'stock_out' => (int) ($db->table('stock_movements')->selectSum('quantity')->where('type', 'out')->get()->getRow('quantity') ?? 0),
        ]);
    }
}
