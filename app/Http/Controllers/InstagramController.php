<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchUserRequest;
use Illuminate\Http\Request;

class InstagramController extends Controller
{
  public function handleSearchUser(SearchUserRequest $request)
  {
    return $this->executeAction(function () use ($request) {
      
    });
  }
}
