<?php

namespace App\Http\Controllers;

use DB;
use Log;
use App\Other\Util;
use App\Http\Requests;
use Illuminate\Http\Request;

class SearchController extends Controller
{

    // Checks user token before calling search function
    public function searchFromApi(Request $request)
    {
        $user_id = Util::getUserIdFromApiToken($request->data["api_token"]);
        if ($user_id === null) {
            return Util::getInvalidApiTokenResponse();
        } else {
            return $this->search($request);
        }
    }


    // TODO - clean this up
    public function search(Request $request)
    {
        //DB::enableQueryLog();


        $searchTerm = $request->data["searchTerm"];
        $category = $request->data["category"];
        $sortBy = $request->data["sortBy"];
        $searchTitles = $request->data["searchTitles"];
        $searchUsernames = $request->data["searchUsernames"];
        $searchText = $request->data["searchText"];


        // if search text is true
        if ($searchText == "true")
        {
            // Search scene text
            $result = DB::table("storyboards")
                ->join("scenes", "storyboards.storyboard_id", "=", "scenes.storyboard_id")
                ->select(
                    "scenes.storyboard_id"
                )
                ->where("storyboards.is_private", "0")
                // need to search with %x% because of html tags
                ->where("scenes.text", "like", "%$searchTerm%")
                ->get();


            // if no results
            if (empty($result) == true)
            {
                return array("success" => true, "data" => $result);
            }



            // put storyboard_ids into array
            $storyboardIds = array();
            foreach ($result as $storyboard)
            {
                array_push($storyboardIds, $storyboard->storyboard_id);
            }

            // get storyboards
            $result2 = DB::table("storyboards")
            ->join("users", "storyboards.user_id", "=", "users.user_id")
            ->select(
                "storyboards.storyboard_id",
                "storyboards.user_id",
                "storyboards.title",
                "storyboards.category",
                "storyboards.allow_comments",
                "storyboards.num_comments",
                "storyboards.scene_color",
                "storyboards.scene_pattern",
                "storyboards.updated_at",
                "users.username"
            )
            ->whereIn("storyboard_id", $storyboardIds)

            // filters
            ->when($category != "All Categories", function ($query) use ($category) {
                return $query->where("storyboards.category", $category);
            })

            // sort
            ->when($sortBy == "Latest", function ($query) use ($searchTerm) {
                return $query->orderBy("storyboards.created_at", "desc");
            })
            ->when($sortBy == "Oldest", function ($query) use ($searchTerm) {
                return $query->orderBy("storyboards.created_at", "asc");
            })

            ->skip(0)
            ->take(10)
            ->get();





            // put storyboard_ids into array
            $storyboardIds = array();
            foreach ($result2 as $storyboard)
            {
                array_push($storyboardIds, $storyboard->storyboard_id);
            }


            // get all scenes for selected storyboards and add to result
            $result3 = DB::table("scenes")
                ->select(
                    "scenes.storyboard_id",
                    "scenes.storyboard_index",
                    "scenes.text",
                    "scenes.canvas_data_svg",
                    "scenes.type"
                )
                ->whereIn("storyboard_id", $storyboardIds)
                ->get();

            $finalResult["storyboards"] = $result2;
            $finalResult["scenes"] = $result3;

            return array("success" => true, "data" => $finalResult);



        // if only need to search storyboard table or username
        } else {

            // Get top 5 storyboards
            $result = DB::table("storyboards")
            ->join("users", "storyboards.user_id", "=", "users.user_id")
            ->select(
                "storyboards.storyboard_id",
                "storyboards.user_id",
                "storyboards.title",
                "storyboards.category",
                "storyboards.allow_comments",
                "storyboards.num_comments",
                "storyboards.scene_color",
                "storyboards.scene_pattern",
                "storyboards.updated_at",
                "users.username"
            )
            ->where("storyboards.is_private", "0")

            // filters
            ->when($category != "All Categories", function ($query) use ($category) {
                return $query->where("storyboards.category", $category);
            })
            ->when($searchTitles == "true" && strlen($searchTerm) > 0,
                   function ($query) use ($searchTerm) {
                return $query->where("storyboards.title", "like", "$searchTerm%");
            })
            ->when($searchUsernames == "true" && strlen($searchTerm) > 0,
                   function ($query) use ($searchTerm) {
                return $query->where("users.username", "like", "$searchTerm%");
            })

            // sort
            ->when($sortBy == "Latest", function ($query) use ($searchTerm) {
                return $query->orderBy("storyboards.created_at", "desc");
            })
            ->when($sortBy == "Oldest", function ($query) use ($searchTerm) {
                return $query->orderBy("storyboards.created_at", "asc");
            })

            ->skip(0)
            ->take(10)
            ->get();

            // if no results
            if (empty($result) == true)
            {
                return array("success" => true, "data" => $result);
            }



            // put storyboard_ids into array
            $storyboardIds = array();
            foreach ($result as $storyboard)
            {
                array_push($storyboardIds, $storyboard->storyboard_id);
            }

            // get all scenes for selected storyboards and add to result
            $result2 = DB::table("scenes")
                ->select(
                    "scenes.storyboard_id",
                    "scenes.storyboard_index",
                    "scenes.text",
                    "scenes.canvas_data_svg",
                    "scenes.type"
                )
                ->whereIn("storyboard_id", $storyboardIds)
                ->get();


            $finalResult["storyboards"] = $result;
            $finalResult["scenes"] = $result2;

            //Log::info(DB::getQueryLog());

            return array("success" => true, "data" => $finalResult);
        }
    }


}
