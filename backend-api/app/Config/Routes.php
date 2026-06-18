<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');

$routes->options('api/(:any)', static function () {
    return service('response')->setStatusCode(204);
});

$routes->group('api', static function ($routes) {
    $routes->post('login', 'Api\AuthController::login');
    $routes->get('summary', 'Api\DashboardController::summary');

    $routes->get('categories', 'Api\CategoriesController::index');
    $routes->get('categories/(:num)', 'Api\CategoriesController::show/$1');
    $routes->get('suppliers', 'Api\SuppliersController::index');
    $routes->get('suppliers/(:num)', 'Api\SuppliersController::show/$1');
    $routes->get('items', 'Api\ItemsController::index');
    $routes->get('items/(:num)', 'Api\ItemsController::show/$1');
    $routes->get('stock-movements', 'Api\StockMovementsController::index');
    $routes->get('stock-movements/(:num)', 'Api\StockMovementsController::show/$1');
});

$routes->group('api', ['filter' => 'tokenauth'], static function ($routes) {
    $routes->post('categories', 'Api\CategoriesController::create');
    $routes->put('categories/(:num)', 'Api\CategoriesController::update/$1');
    $routes->delete('categories/(:num)', 'Api\CategoriesController::delete/$1');

    $routes->post('suppliers', 'Api\SuppliersController::create');
    $routes->put('suppliers/(:num)', 'Api\SuppliersController::update/$1');
    $routes->delete('suppliers/(:num)', 'Api\SuppliersController::delete/$1');

    $routes->post('items', 'Api\ItemsController::create');
    $routes->put('items/(:num)', 'Api\ItemsController::update/$1');
    $routes->delete('items/(:num)', 'Api\ItemsController::delete/$1');

    $routes->post('stock-movements', 'Api\StockMovementsController::create');
    $routes->put('stock-movements/(:num)', 'Api\StockMovementsController::update/$1');
    $routes->delete('stock-movements/(:num)', 'Api\StockMovementsController::delete/$1');
});
