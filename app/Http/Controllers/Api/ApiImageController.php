<?php

namespace App\Http\Controllers\Api;

use Log;
use Auth;
use GuzzleHttp;
use App\Other\Util;
use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use GuzzleHttp\Exception\ConnectException;

class ApiImageController extends Controller
{

    public function __construct()
    {

    }


    // ---------------------------------------- Don't require token ----------------------------------------





    // ---------------------------------------- Require token ----------------------------------------


    // Get a single storyboard and its scenes
    public function imageProxy($api_token, $imageName)
    {
        $user_id = Util::getUserIdFromApiToken($api_token);
        if ($user_id === null) {
            return Util::getInvalidApiTokenResponse();
        } else {

            try
            {
                $url = Util::getBlobHostUrl() . "user" . $user_id . "/" . $imageName;
                $client = new GuzzleHttp\Client();
                $res = $client->get($url);
                return $res->getBody();
            } catch (ConnectException $e)
            {
                Log::info("image-proxy error");
                Log::info($e->getMessage());
                return null;
            }
        }
    }
}
