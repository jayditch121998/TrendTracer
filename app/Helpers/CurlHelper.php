<?php

namespace App\Helpers;

class CurlHelper
{
  /**
   * Make a GET request using cURL.
   *
   * @param string $url The base URL to request.
   * @param array $queryParams Query parameters to append to the URL.
   * @param string|null $token Optional access token for authentication.
   * @return mixed Response data or false on failure.
   */
  public static function getRequest(string $url, array $queryParams = [], ?string $token = null)
  {
    // Build the full URL with query parameters
    $queryString = http_build_query($queryParams);
    $fullUrl = $url . '?' . $queryString;

    // Initialize cURL
    $ch = curl_init();

    // Set cURL options
    curl_setopt($ch, CURLOPT_URL, $fullUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
      'Accept: application/json',
      'Authorization: Bearer ' . ($token ?? config('services.facebook.access_token')) // Use provided token or fallback to .env
    ]);

    // ⚠️ Disable SSL verification in local environment
    if (app()->environment('local')) {
      curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
      curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    }

    // Execute request and capture response
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);

    // Close cURL
    curl_close($ch);

    // Handle errors
    if ($response === false) {
      return ['error' => 'cURL Error: ' . $error];
    }

    // Decode and return JSON response
    return json_decode($response, true);
  }
}
