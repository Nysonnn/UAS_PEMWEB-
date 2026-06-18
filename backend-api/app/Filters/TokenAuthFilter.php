<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class TokenAuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $header = $request->getHeaderLine('Authorization');
        $token = str_starts_with($header, 'Bearer ') ? substr($header, 7) : '';
        $expectedToken = env('AUTH_TOKEN', 'uas-web2-e-inventory-token');

        if (! hash_equals($expectedToken, $token)) {
            return service('response')
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON([
                    'status' => 401,
                    'message' => 'Unauthorized. Bearer token tidak valid atau tidak dikirim.',
                ]);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        return $response;
    }
}
