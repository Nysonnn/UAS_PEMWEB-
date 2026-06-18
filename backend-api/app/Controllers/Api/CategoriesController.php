<?php

namespace App\Controllers\Api;

use App\Models\CategoryModel;
use CodeIgniter\RESTful\ResourceController;

class CategoriesController extends ResourceController
{
    protected $modelName = CategoryModel::class;
    protected $format = 'json';

    public function index()
    {
        return $this->respond($this->model->orderBy('name', 'ASC')->findAll());
    }

    public function show($id = null)
    {
        $category = $this->model->find($id);
        return $category ? $this->respond($category) : $this->failNotFound('Kategori tidak ditemukan.');
    }

    public function create()
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();
        if (! $this->validateData($data, ['name' => 'required|min_length[3]|max_length[120]'])) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $id = $this->model->insert($data);
        return $this->respondCreated($this->model->find($id));
    }

    public function update($id = null)
    {
        if (! $this->model->find($id)) {
            return $this->failNotFound('Kategori tidak ditemukan.');
        }

        $data = $this->request->getJSON(true) ?? [];
        if (! $this->validateData($data, ['name' => 'required|min_length[3]|max_length[120]'])) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $this->model->update($id, $data);
        return $this->respond($this->model->find($id));
    }

    public function delete($id = null)
    {
        if (! $this->model->find($id)) {
            return $this->failNotFound('Kategori tidak ditemukan.');
        }

        $this->model->delete($id);
        return $this->respondDeleted(['message' => 'Kategori berhasil dihapus.']);
    }
}
