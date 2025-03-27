<?php

namespace App\Http\Controllers;

use App\Http\Requests\GetRunResultRequest;
use App\Http\Requests\RunScraperRequest;
use App\Services\ApifyService;

class ApifyController extends Controller
{
  public function handleRunner(RunScraperRequest $request)
  {
    return $this->executeAction(function () use ($request) {
      return (new ApifyService)->runScraper($request->username, $request->limit_result);
    });
  }

  public function getResults(GetRunResultRequest $request)
  {
    return $this->executeAction(function () use ($request) {
      return (new ApifyService)->getDataset($request->dataset_id);
    });
  }
}
