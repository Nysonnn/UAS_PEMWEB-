<?php

namespace App\Controllers\Api;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;

class AuthController extends ResourceController
{
    protected $format = 'json';

    public function login()
    {
        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $email = $payload['email'] ?? '';
        $password = $payload['password'] ?? '';

        $user = (new UserModel())->where('email', $email)->first();

        if (! $user || ! password_verify($password, $user['password_hash'])) {
            return $this->failUnauthorized('Email atau password salah.');
        }

        return $this->respond([
            'message' => 'Login berhasil.',
            'token' => env('AUTH_TOKEN', 'uas-web2-e-inventory-token'),
            'user' => [
                'id' => (int) $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role'],
            ],
        ]);
    }
}
