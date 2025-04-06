<?php

use App\Events\TriggerFrontend;
use App\Http\Controllers\ApifyController;
use App\Http\Controllers\InstagramController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/test', function (Request $request) {
    return 'yes';
})->middleware('auth:sanctum');

Route::controller(InstagramController::class)->prefix('/instagram')->group(function() {
  Route::get('/search/user', 'handleSearchUser');
  Route::get('/search/user/medias', 'handleSearchUserMedias');
});

Route::controller(ApifyController::class)->prefix('apify')->group(function() {
  Route::post('/run','handleRunner');
  Route::get('/run/results','getResults');
});

Route::get('/webhook', function (Request $request) {
  broadcast(new TriggerFrontend(['dataset_id' => $request->datasetId]));
  return 'Broadcast sent!';
});

Route::prefix('auth')->group(function () {
  Route::post('/register', [UserController::class, 'register']);
  Route::post('/login', [UserController::class, 'login'])->name('login');
});
