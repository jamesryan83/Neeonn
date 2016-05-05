<?php

namespace App\Http\Controllers;

use Log;
use Auth;
use GuzzleHttp;
use App\Other\Util;
use App\Other\Azure;
use App\Models\User;
use App\Models\Storyboard;
use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PublicController extends Controller
{

    // ----------------------------  Public Page Functions  ----------------------------


    // returns the home page
    public function getHomePage()
    {
        if (Auth::check()) {
            return redirect("search");
        } else {
            return view("home");
        }
    }


    // Search page
    public function getSearchPage(Request $request)
    {
        return view("search");
    }


    // Help page
    public function getHelpPage()
    {
        return view("help");
    }


    // User page
    public function getUserPage()
    {
        return view("user");
    }


    // Comments page
    public function getCommentsPage($storyboard_id)
    {
        return view("comments", ["storyboard_id" => $storyboard_id]);
    }




    // ----------------------------  Public Image Proxy  ----------------------------


    // get image from azure (public images version) - required for html canvas
    public function imageProxyPublic($user_id, $imageName)
    {
        $url = Util::getBlobHostUrl() . "user" . $user_id . "/" . $imageName;
        $client = new GuzzleHttp\Client();
        $res = $client->get($url);
        return $res->getBody();
    }
}
