<?php

namespace App\Models;

use CodeIgniter\Model;

class ItemModel extends Model
{
    protected $table = 'items';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'category_id',
        'supplier_id',
        'sku',
        'name',
        'unit',
        'stock',
        'minimum_stock',
        'price',
    ];
    protected $useTimestamps = true;
    protected $returnType = 'array';
}
