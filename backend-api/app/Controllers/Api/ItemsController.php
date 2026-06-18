<?php

namespace App\Controllers\Api;

use App\Models\ItemModel;
use CodeIgniter\RESTful\ResourceController;

class ItemsController extends ResourceController
{
    protected $modelName = ItemModel::class;
    protected $format = 'json';

    public function index()
    {
        $items = $this->model
            ->select('items.*, categories.name AS category_name, suppliers.name AS supplier_name')
            ->join('categories', 'categories.id = items.category_id')
            ->join('suppliers', 'suppliers.id = items.supplier_id')
            ->orderBy('items.name', 'ASC')
            ->findAll();

        return $this->respond($items);
    }

    public function show($id = null)
    {
        $item = $this->model
            ->select('items.*, categories.name AS category_name, suppliers.name AS supplier_name')
            ->join('categories', 'categories.id = items.category_id')
            ->join('suppliers', 'suppliers.id = items.supplier_id')
            ->find($id);

        return $item ? $this->respond($item) : $this->failNotFound('Barang tidak ditemukan.');
    }

    public function create()
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();
        if (! $this->validateData($data, $this->rules())) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $id = $this->model->insert($this->normalize($data));
        return $this->respondCreated($this->model->find($id));
    }

    public function update($id = null)
    {
        if (! $this->model->find($id)) {
            return $this->failNotFound('Barang tidak ditemukan.');
        }

        $data = $this->request->getJSON(true) ?? [];
        if (! $this->validateData($data, $this->rules($id))) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $this->model->update($id, $this->normalize($data));
        return $this->respond($this->model->find($id));
    }

    public function delete($id = null)
    {
        if (! $this->model->find($id)) {
            return $this->failNotFound('Barang tidak ditemukan.');
        }

        $this->model->delete($id);
        return $this->respondDeleted(['message' => 'Barang berhasil dihapus.']);
    }

    private function rules(?int $id = null): array
    {
        $skuRule = $id ? "required|max_length[40]|is_unique[items.sku,id,{$id}]" : 'required|max_length[40]|is_unique[items.sku]';

        return [
            'category_id' => 'required|is_natural_no_zero',
            'supplier_id' => 'required|is_natural_no_zero',
            'sku' => $skuRule,
            'name' => 'required|min_length[3]|max_length[160]',
            'unit' => 'required|max_length[30]',
            'stock' => 'required|integer|greater_than_equal_to[0]',
            'minimum_stock' => 'required|integer|greater_than_equal_to[0]',
            'price' => 'required|numeric|greater_than_equal_to[0]',
        ];
    }

    private function normalize(array $data): array
    {
        return [
            'category_id' => (int) $data['category_id'],
            'supplier_id' => (int) $data['supplier_id'],
            'sku' => strtoupper(trim($data['sku'])),
            'name' => trim($data['name']),
            'unit' => trim($data['unit']),
            'stock' => (int) $data['stock'],
            'minimum_stock' => (int) $data['minimum_stock'],
            'price' => (float) $data['price'],
        ];
    }
}
