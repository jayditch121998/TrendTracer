<?php

namespace App\Services;

use App\Helpers\ApifyCurlHelper;

class ApifyService
{
  public function runScraper(string $username, int $limitResult = 10)
  {
    $url = "https://api.apify.com/v2/acts/". env('ACTOR_ID') ."/runs?token=". env('APIFY_TOKEN');
    $params = [
      "username" => [
        $username
      ],
      "resultsLimit" => $limitResult
    ];
    return ApifyCurlHelper::runScraperUrl($url, json_encode($params));
  }

  public function getDataset(string $datasetId)
  {
    $url = "https://api.apify.com/v2/datasets/$datasetId/items?token=". env('APIFY_TOKEN');
    
    $response = ApifyCurlHelper::getDataset($url);

    $filtered = collect($response)->map(function ($item) {
      return [
        'id' => $item['id'],
        'user_url' => $item['inputUrl'],
        'caption' => $item['caption'],
        'post_url' => $item['url'],
        'likes' => $item['likesCount'],
        'comments_count' => $item['commentsCount'],
        'video_url' => $item['videoUrl'],
        'views_view_count' => $item['videoViewCount'],
        'video_play_count' => $item['videoPlayCount'],
      ];
    });

    return $filtered;
  }
}