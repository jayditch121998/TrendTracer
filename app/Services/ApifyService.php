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
  public function runScraper($username, $accessToken)
  {
    // $baseUrl = "https://api.apify.com/v2/acts/xMc5Ga1oCONPmWJIa/runs?token=apify_api_itb9SRus81ofAen1bIQ5JR9yfIgBtC1buE35";
    $baseUrl = 'https://api.apify.com/v2/acts/xMc5Ga1oCONPmWJIa/run-sync-get-dataset-items?token=' . $accessToken;
    $params = [
      "username" => [
        $username
      ],
      "resultsLimit" => 4
    ];

    $body = wp_json_encode($params);

    $args = [
      'method'    => 'POST',
      'headers'   => [
        'Content-Type' => 'application/json',
      ],
      'body'      => $body,
      'timeout'   => 30,
      'sslverify' => !(defined('WP_ENV') && WP_ENV === 'local'),
    ];
  
    $response = wp_remote_post($baseUrl, $args);
  
    if (is_wp_error($response)) {
      return ['error' => $response->get_error_message()];
    }
  
    // $body = wp_remote_retrieve_body($response);
    // return $decode ? json_decode($body, true) : $body;

  }
}
