<?php

namespace App\Services;

use App\Helpers\CurlHelper;

class InstagramService
{
  private string $baseUrl = 'https://graph.facebook.com/v22.0/17841467514402068';

  private array $mediaFields = [
    'id',
    'caption',
    'like_count',
    'comments_count',
    'timestamp',
    'media_product_type',
    'media_type',
    'owner',
    'permalink',
    'media_url',
    'children{media_url}'
  ];

  public function searchUserInstagram(string $username, int $limit)
  {
    $businessDiscoveryFields = [
      'followers_count',
      'media_count',
      'username',
      'website',
      'name',
      'ig_id',
      'profile_picture_url',
      'biography',
      'follows_count'
    ];

    $fields = 'business_discovery.username(' . $username . '){' . implode(',', $businessDiscoveryFields) . '}';

    $queryParams = [
      'fields' => $fields
    ];
    $accessToken = config('meta.instagram.api_token');

    
    // Call the CurlHelper with token null to use default
    $response = CurlHelper::getRequest($this->baseUrl, $queryParams, $accessToken);
    
    // Run Scraper
    (new ApifyService)->runScraper($username, $limit);

    return $response;
  }

  public function searchUserMedias(string $username)
  {
    $businessDiscoveryFields = [
      'followers_count',
      'media_count',
      'username',
      'website',
      'name',
      'ig_id',
      'profile_picture_url',
      'biography',
      'follows_count',
      'media{' . implode(',', $this->mediaFields) . '}'
    ];

    $fields = 'business_discovery.username(' . $username . '){' . implode(',', $businessDiscoveryFields) . '}';

    $queryParams = [
      'fields' => $fields
    ];

    $accessToken = config('meta.instagram.api_token');

    // Call the CurlHelper with token null to use default
    return CurlHelper::getRequest($this->baseUrl, $queryParams, $accessToken);
  }
}
