<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchUserRequest;
use App\Services\InstagramService;
use Illuminate\Http\Request;

class InstagramController extends Controller
{
  public function handleSearchUser(SearchUserRequest $request)
  {
    return $this->executeAction(function () use ($request) {
      return (new InstagramService)->searchUserInstagram($request->username);
    });
  }

  public function handleSearchUserMedias(SearchUserRequest $request)
  {
    return $this->executeAction(function () use($request) {
      return (new InstagramService)->searchUserMedias($request->username);
    });
  }
}
