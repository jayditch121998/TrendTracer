<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller as BaseController;

abstract class Controller extends BaseController
{
  protected function successResponse($data = null, string $message = 'Success', int $code = 200): JsonResponse
  {
    return response()->json([
      'success' => true,
      'message' => $message,
      'data' => $data
    ], $code);
  }

  protected function errorResponse(string $message = 'Something went wrong.', int $code = 400, $errors = null): JsonResponse
  {
    return response()->json([
      'success' => false,
      'message' => $message,
      'errors' => $errors
    ], $code);
  }

  protected function executeAction(callable $action)
  {
    try {
      return $action();
    } catch(\Throwable $throwable) {
      $code = $throwable->getCode() ?: 500;
      return $this->errorResponse($throwable->getMessage(), $code);
    }
  }
}
