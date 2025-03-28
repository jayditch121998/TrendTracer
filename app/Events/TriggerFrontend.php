<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class TriggerFrontend implements ShouldBroadcastNow
{
  use InteractsWithSockets, SerializesModels;

  public $data;

  public function __construct($data)
  {
    $this->data = $data;
  }

  public function broadcastOn()
  {
    \Log::info($this->data);
    return new Channel('frontend-channel'); // 👈 listen to this on frontend
  }

  public function broadcastAs()
  {
    return 'triggered'; // 👈 frontend event name
  }
}
