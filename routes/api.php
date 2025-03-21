<?php

use App\Http\Controllers\InstagramController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
Route::post('test', function () {
  return 'pakyuuu';
});

Route::controller(InstagramController::class)->prefix('/instagram')->group(function() {
  Route::get('/search/user', 'handleSearchUser');
  Route::get('/search/user/medias', 'handleSearchUserMedias');
});

Route::prefix('auth')->group(function () {
  Route::post('/register', [UserController::class, 'register']);
  Route::post('/login', [UserController::class, 'login']);
});