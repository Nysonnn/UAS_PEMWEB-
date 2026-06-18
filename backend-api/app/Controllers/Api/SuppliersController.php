<?php

namespace App\Controllers\Api;

use App\Models\SupplierModel;
use CodeIgniter\RESTful\ResourceController;

class SuppliersController extends ResourceController
{
    protected $modelName = SupplierModel::class;
    protected $format = 'json';

    public function index()
    {
        return $this->respond($this->model->orderBy('name', 'ASC')->findAll());
    }

    public function show($id = null)
    {
        $supplier = $this->model->find($id);
        return $supplier ? $this->respond($supplier) : $this->failNotFound('Supplier tidak ditemukan.');
    }

    public function create()
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();
        if (! $this->validateData($data, ['name' => 'required|min_length[3]|max_length[140]'])) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $id = $this->model->insert($data);
        return $this->respondCreated($this->model->find($id));
    }

    public function update($id = null)
    {
        if (! $this->model->find($id)) {
            return $this->failNotFound('Supplier tidak ditemukan.');
        }

        $data = $this->request->getJSON(true) ?? [];
        if (! $this->validateData($data, ['name' => 'required|min_length[3]|max_length[140]'])) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $this->model->update($id, $data);
        return $this->respond($this->model->find($id));
    }

    public function delete($id = null)
    {
        if (! $this->model->find($id)) {
            return $this->failNotFound('Supplier tidak ditemukan.');
        }

        $this->model->delete($id);
        return $this->respondDeleted(['message' => 'Supplier berhasil dihapus.']);
    }
}
