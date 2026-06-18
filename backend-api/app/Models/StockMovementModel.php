<?php

namespace App\Models;

use CodeIgniter\Model;

class StockMovementModel extends Model
{
    protected $table = 'stock_movements';
    protected $primaryKey = 'id';
    protected $allowedFields = ['item_id', 'type', 'quantity', 'notes', 'movement_date'];
    protected $useTimestamps = true;
    protected $returnType = 'array';
}
