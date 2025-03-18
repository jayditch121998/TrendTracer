<?php

use Illuminate\Support\Facades\Route;

// Catch-all route for React SPA
Route::get('/{any}', function () {
  return view('app'); // Ensure this points to the correct Blade file
})->where('any', '.*');
