<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
  public function register(RegisterRequest $request)
  {
    return $this->executeAction(function () use ($request) {
      $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password)
      ]);

      $token = $user->createToken('auth_token')->plainTextToken;

      return $this->successResponse([
        'user' => $user,
        'token' => $token
      ]);
    });
  }

  public function login(LoginRequest $request)
  {
    return $this->executeAction(function () use ($request) {
      $user = User::where('email', $request->email)->first();

      if (!$user || !Hash::check($request->password, $user->password)) {
        throw new Exception('These credentials do not match our records.', 401);
      }

      $token = $user->createToken('auth_token')->plainTextToken;

      return $this->successResponse([
        'message' => 'Login successful',
        'token' => $token
      ]);
    });
  }
}
