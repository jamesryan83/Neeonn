<?php

namespace App\Http\Controllers;

use DB;
use Log;
use Auth;
use App\Models\Storyboard;
use App\Models\Scene;
use App\Http\Requests;
use Illuminate\Http\Request;



class StoryboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }


    // Get a single storyboard and its scenes
    public function getStoryboard(Request $request)
    {
        $user = Auth::user();
        $result = $user->load(["storyboards.scenes" => function ($query) use ($request) {
            $query->where("storyboard_id", $request->storyboardId);
        }])["storyboards"];

        foreach ($result as $storyboard)
        {
            if ($storyboard["storyboard_id"] == $request->storyboardId)
            {
                $storyboard["username"] = $user->username;
                return array("success" => true, "data" => $storyboard);
            }
        }

        return array("success" => true, "message" => "storyboard not found");
    }


    // Get all storyboards
    public function getAllStoryboards()
    {
        $user = Auth::user();
        $result = $user->load("storyboards.scenes")["storyboards"];

        foreach ($result as $storyboard)
        {
            $storyboard["username"] = $user->username;
        }

        // TODO : error check
        return array("success" => true, "data" => $result);
    }


    // Create a storyboard
    public function createStoryboard(Request $request)
    {
        $request = $request->data;
        $userId = Auth::user()->user_id;

        // storyboard
        $storyboard = Storyboard::create([
            "user_id" => $userId,
            "title" => $request["title"],
            "category" => $request["category"],
            "is_private" => $request["isPrivate"],
            "allow_comments" => $request["allowComments"],
        ]);

        // scene
        $result = Scene::create([
            "user_id" => $userId,
            "storyboard_id" => $storyboard->storyboard_id,
            "type" => $request["firstScene"]
        ]);


        // TODO : error check
        return array("success" => true, "data" => $storyboard->storyboard_id);
    }


    // Save a storyboard
    public function saveStoryboard(Request $request)
    {
        $data = $request->storyboardData;

        $result = DB::transaction(function () use ($data)
        {
            $userId = Auth::user()->user_id;

            // Update storyboard
            $storyboard = Storyboard::where([
                ["storyboard_id", $data["storyboardId"]],
                ["user_id", $userId]
            ])->first();

            $storyboard->allow_comments = $data["allowComments"];
            $storyboard->category = $data["category"];
            $storyboard->is_private = $data["isPrivate"];            
            $storyboard->title = $data["title"];
            $storyboard->scene_color = $data["sceneColor"];
            $storyboard->text_color = $data["textColor"];
            $storyboard->scene_pattern = $data["scenePattern"];


            $storyboard->save();


            // Delete existing scenes for storyboard
            Scene::where("storyboard_id", $data["storyboardId"])->delete();

            // Insert new scenes
            if (array_key_exists("scenes", $data))
            {
                $scenes = array();
                for ($i = 0; $i < count($data["scenes"]); $i++)
                {
                    $svgData = $data["scenes"][$i]["canvasDataSvg"];

                    // TODO change for production
//                    $svgData = str_replace("http://shoterate.localhost:8101/image-proxy",
//                       "https://shoterate.blob.core.windows.net/user" . $userId, $svgData);

                    array_push($scenes, new Scene([
                        "user_id" => $userId,
                        "storyboard_id" => $data["storyboardId"],
                        "storyboard_index" => $data["scenes"][$i]["index"],
                        "type" => $data["scenes"][$i]["type"],
                        "canvas_data_json" => $data["scenes"][$i]["canvasDataJson"],
                        "canvas_data_svg" => $svgData,
                        "text" => $data["scenes"][$i]["text"] ]));
                }

                $storyboard->scenes()->saveMany($scenes);
            }
        });

        if ($result == 1)
        {
            return array("success" => true, "data" => true);
        }
        else
        {
            return array("success" => true, "message" => "Error saving storyboard");
        }

        return array("success" => true, "data" => true);
    }


    // Delete a storyboard
    public function deleteStoryboard(Request $request)
    {
        // Delete associated scenes first
        $result = Scene::where("storyboard_id", $request->storyboardId)->delete();

        // Delete storyboard
        $result = Storyboard::where([
            ["storyboard_id", $request->storyboardId],
            ["user_id", Auth::user()->user_id]
        ])->delete();


        if ($result === 1)
        {
            return array("success" => true, "data" => $result);
        }
        else
        {
            return array("success" => false, "message" => "Error deleting Storyboard");
        }
    }
}
