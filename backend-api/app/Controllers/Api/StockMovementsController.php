<?php

namespace App\Controllers\Api;

use App\Models\ItemModel;
use App\Models\StockMovementModel;
use CodeIgniter\RESTful\ResourceController;

class StockMovementsController extends ResourceController
{
    protected $modelName = StockMovementModel::class;
    protected $format = 'json';

    public function index()
    {
        $movements = $this->model
            ->select('stock_movements.*, items.name AS item_name, items.sku')
            ->join('items', 'items.id = stock_movements.item_id')
            ->orderBy('stock_movements.movement_date', 'DESC')
            ->orderBy('stock_movements.id', 'DESC')
            ->findAll();

        return $this->respond($movements);
    }

    public function show($id = null)
    {
        $movement = $this->model
            ->select('stock_movements.*, items.name AS item_name, items.sku')
            ->join('items', 'items.id = stock_movements.item_id')
            ->find($id);

        return $movement ? $this->respond($movement) : $this->failNotFound('Histori stok tidak ditemukan.');
    }

    public function create()
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();
        if (! $this->validateData($data, $this->rules())) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $itemModel = new ItemModel();
        $item = $itemModel->find($data['item_id']);
        if (! $item) {
            return $this->failNotFound('Barang tidak ditemukan.');
        }

        $quantity = (int) $data['quantity'];
        $newStock = $this->calculateStock((int) $item['stock'], $data['type'], $quantity);
        if ($newStock < 0) {
            return $this->failValidationErrors(['quantity' => 'Stok tidak cukup untuk transaksi keluar.']);
        }

        $id = $this->model->insert($this->normalize($data));
        $itemModel->update($item['id'], ['stock' => $newStock]);

        return $this->respondCreated($this->model->find($id));
    }

    public function update($id = null)
    {
        $oldMovement = $this->model->find($id);
        if (! $oldMovement) {
            return $this->failNotFound('Histori stok tidak ditemukan.');
        }

        $data = $this->request->getJSON(true) ?? [];
        if (! $this->validateData($data, $this->rules())) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $itemModel = new ItemModel();
        $oldItem = $itemModel->find($oldMovement['item_id']);
        $newItem = $itemModel->find($data['item_id']);
        if (! $oldItem || ! $newItem) {
            return $this->failNotFound('Barang tidak ditemukan.');
        }

        $restoredOldStock = $this->reverseStock((int) $oldItem['stock'], $oldMovement['type'], (int) $oldMovement['quantity']);
        $newItemStockBase = $oldItem['id'] === $newItem['id'] ? $restoredOldStock : (int) $newItem['stock'];
        $newStock = $this->calculateStock($newItemStockBase, $data['type'], (int) $data['quantity']);

        if ($newStock < 0) {
            return $this->failValidationErrors(['quantity' => 'Stok tidak cukup untuk transaksi keluar.']);
        }

        $this->model->update($id, $this->normalize($data));
        $itemModel->update($oldItem['id'], ['stock' => $restoredOldStock]);
        $itemModel->update($newItem['id'], ['stock' => $newStock]);

        return $this->respond($this->model->find($id));
    }

    public function delete($id = null)
    {
        $movement = $this->model->find($id);
        if (! $movement) {
            return $this->failNotFound('Histori stok tidak ditemukan.');
        }

        $itemModel = new ItemModel();
        $item = $itemModel->find($movement['item_id']);
        if ($item) {
            $itemModel->update($item['id'], [
                'stock' => $this->reverseStock((int) $item['stock'], $movement['type'], (int) $movement['quantity']),
            ]);
        }

        $this->model->delete($id);
        return $this->respondDeleted(['message' => 'Histori stok berhasil dihapus.']);
    }

    private function rules(): array
    {
        return [
            'item_id' => 'required|is_natural_no_zero',
            'type' => 'required|in_list[in,out]',
            'quantity' => 'required|integer|greater_than[0]',
            'movement_date' => 'required|valid_date[Y-m-d]',
            'notes' => 'permit_empty|max_length[500]',
        ];
    }

    private function normalize(array $data): array
    {
        return [
            'item_id' => (int) $data['item_id'],
            'type' => $data['type'],
            'quantity' => (int) $data['quantity'],
            'movement_date' => $data['movement_date'],
            'notes' => $data['notes'] ?? null,
        ];
    }

    private function calculateStock(int $currentStock, string $type, int $quantity): int
    {
        return $type === 'in' ? $currentStock + $quantity : $currentStock - $quantity;
    }

    private function reverseStock(int $currentStock, string $type, int $quantity): int
    {
        return $type === 'in' ? $currentStock - $quantity : $currentStock + $quantity;
    }
}
