<?php

namespace App\Helpers;

class ApifyCurlHelper
{
  public static function runScraperUrl(string $url, $params, $decode = true)
  {
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, is_string($params) ? $params : json_encode($params));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
      'Content-Type: application/json'
    ]);

    // ⚠️ Disable SSL verification in local environment
    if (app()->environment('local')) {
      curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
      curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    }

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
      $error = curl_error($ch);
      curl_close($ch);
      return response()->json(['error' => $error], 500);
    }

    curl_close($ch);
    return $decode ? json_decode($response, true) : $response;
  }

  public static function getDataset(string $url)
  {
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
      'Accept: application/json',
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