<?php

namespace App\Listeners;

use Log;
use Auth;
use App\Other\Util;
use Illuminate\Auth\Events\Login;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class UserEventListener
{
    // User login event
    public function onUserLogin($event)
    {
        $user = Auth::user();
        $user->last_login = Util::getCurrentDateTime();
        $user->save();
    }


    // User logout event
    public function onUserLogout($event)
    {

    }
}
