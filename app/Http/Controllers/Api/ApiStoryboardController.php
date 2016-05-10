<?php

namespace App\Http\Controllers\Api;

use DB;
use Log;
use Auth;
use Exception;
use App\Other\Util;
use App\Models\User;
use App\Models\Scene;
use App\Http\Requests;
use App\Other\Storyboards;
use App\Models\Storyboard;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ApiStoryboardController extends Controller
{

    public function __construct()
    {

    }




    // ---------------------------------------- Storyboards ----------------------------------------


    // Get a single storyboard and its scenes
    public function getStoryboard($storyboard_id, $api_token)
    {
        $user = User::where("api_token", $api_token)->get();
        if ($user === null || count($user) == 0) {
            return Util::getInvalidApiTokenResponse();
        } else {
            return Storyboards::getStoryboard($storyboard_id);
        }
    }


    // Get all Storyboards
    public function getAllStoryboards($api_token)
    {
        $user = User::where("api_token", $api_token)->get();
        if ($user === null || count($user) == 0) {
            return Util::getInvalidApiTokenResponse();
        } else {
            return Storyboards::getAllStoryboards($user[0]);
        }
    }


    // Create Storyboard
    public function createStoryboard(Request $request)
    {
        $user_id = Util::getUserIdFromApiToken($request->data["api_token"]);
        if ($user_id === null) {
            return Util::getInvalidApiTokenResponse();
        } else {
            return Storyboards::createStoryboard($user_id, $request->data);
        }
    }


    // Save Storyboard
    public function saveStoryboard(Request $request)
    {
        $user_id = Util::getUserIdFromApiToken($request->data["api_token"]);
        if ($user_id === null) {
            return Util::getInvalidApiTokenResponse();
        } else {
            return Storyboards::saveStoryboard($user_id, $request->data);
        }
    }


    // Update Storyboard details (api route only)
    public function updateStoryboardDetails(Request $request)
    {
        $data = $request->data;
        $user_id = Util::getUserIdFromApiToken($data["api_token"]);
        if ($user_id === null) {
            return Util::getInvalidApiTokenResponse();
        } else {
            return Storyboards::updateStoryboardDetails($user_id, $data);
        }
    }


    // Delete a Storyboard
    public function deleteStoryboard(Request $request)
    {
        $user_id = Util::getUserIdFromApiToken($request->data["api_token"]);
        if ($user_id === null) {
            return Util::getInvalidApiTokenResponse();
        } else {
            return Storyboards::deleteStoryboard($user_id, $request->data["storyboard_id"]);
        }
    }









    // ---------------------------------------- Scenes ----------------------------------------


    // Create Scene
    public function createScene(Request $request)
    {
        $user_id = Util::getUserIdFromApiToken($request->data["api_token"]);
        if ($user_id === null) {
            return Util::getInvalidApiTokenResponse();
        } else {
            return Storyboards::createScene($user_id, $request->data);
        }
    }


    // Update scene canvas
    public function updateSceneCanvas(Request $request)
    {
        $user_id = Util::getUserIdFromApiToken($data["api_token"]);
        if ($user_id === null) {
            return Util::getInvalidApiTokenResponse();
        } else {
            return Storyboards::updateSceneCanvas($request->data);
        }
    }


    // Update scene text
    public function updateSceneText(Request $request)
    {
        $user_id = Util::getUserIdFromApiToken($data["api_token"]);
        if ($user_id === null) {
            return Util::getInvalidApiTokenResponse();
        } else {
            return Storyboards::updateSceneText($request->data);
        }
    }


    // Update scene indicies
    public function updateSceneIndicies(Request $request)
    {
        $user_id = Util::getUserIdFromApiToken($data["api_token"]);
        if ($user_id === null) {
            return Util::getInvalidApiTokenResponse();
        } else {
            return Storyboards::updateSceneIndicies($request->data);
        }
    }


    // Delete Scene
    public function deleteScene(Request $request)
    {
        $user_id = Util::getUserIdFromApiToken($request->data["api_token"]);
        if ($user_id === null) {
            return Util::getInvalidApiTokenResponse();
        } else {
            return Storyboards::deleteScene($user_id, $request->data);
        }
    }

}
