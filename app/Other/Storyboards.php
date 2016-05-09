<?php

namespace App\Other;

use DB;
use Log;
use Auth;
use App\Models\User;
use App\Models\Storyboard;
use App\Models\Scene;
use App\Models\Comment;
use App\Models\CommentVote;


class Storyboards
{


    // ---------------------------------------- Storyboards ----------------------------------------

    // Get a single storyboard and its scenes
    public static function getStoryboard($storyboard_id, $isAuthorized = false)
    {
        // only public storyboards if not authorized
        $whereArray = [["storyboard_id", $storyboard_id]];
        if ($isAuthorized == false) {
            array_push($whereArray, ["is_private", 0]);
        }

        // get storyboard
        $storyboard = DB::table("storyboards")
                ->join("users", "storyboards.user_id", "=", "users.user_id")
                ->select("storyboards.*", "users.username")
                ->where($whereArray)
                ->first();

        if ($storyboard == null) {
            return array("success" => false,
                         "message" => "This storyboard doesn't exist or is private");
        }

        // stdClass to associative array
        $storyboard = json_decode(json_encode($storyboard), true);

        // add scenes
        $storyboard["scenes"] = Scene::where("storyboard_id", $storyboard_id)->get();

        return array("success" => true, "data" => $storyboard);
    }



    // Get all storyboards
    public static function getAllStoryboards($userObject)
    {
        // get storyboards
        $storyboards = $userObject->load("storyboards.scenes")["storyboards"];

        if ($storyboards == null) {
            return array("success" => false, "message" => "Error getting storyboards");
        }

        // add username to storyboards
        foreach ($storyboards as $storyboard)
        {
            $storyboard["username"] = $userObject->username;
        }

        return array("success" => true, "data" => $storyboards);
    }



    // Create a storyboard
    public static function createStoryboard($user_id, $data)
    {
        $storyboard = null;

        DB::beginTransaction();

        // storyboard
        try {
            $storyboard = Storyboard::create([
                "user_id" => $user_id,
                "title" => $data["title"],
                "category" => $data["category"],
                "is_private" => $data["is_private"],
                "allow_comments" => $data["allow_comments"],
            ]);
        } catch (Exception $e) {
            Log::info($e);
            DB::rollback();
            return array("success" => false, "message" => "Error creating storyboard");
        }


        // scene
        try {
            Scene::create([
                "user_id" => $user_id,
                "storyboard_id" => $storyboard->storyboard_id,
                "type" => $data["type"]
            ]);
        } catch (Exception $e) {
            Log::info($e);
            DB::rollback();
            return array("success" => false, "message" => "Error creating storyboard");
        }

        DB::commit();
        return array("success" => true, "data" => $storyboard->storyboard_id);
    }



    // Update storyboard details
    public static function updateStoryboardDetails($user_id, $data)
    {
        DB::beginTransaction();

        try {
            $storyboard = Storyboard::where([
                ["storyboard_id", $data["storyboard_id"]],
                ["user_id", $user_id]
            ])->first();

            $storyboard->allow_comments = $data["allow_comments"];
            $storyboard->category = $data["category"];
            $storyboard->is_private = $data["is_private"];
            $storyboard->title = $data["title"];
            $storyboard->scene_color = $data["scene_color"];
            $storyboard->scene_pattern = $data["scene_pattern"];

            $storyboard->save();

        } catch (Exception $e) {
            Log::info($e);
            DB::rollback();
            return array("success" => false, "message" => "Error updating storyboard details");
        }

        DB::commit();
        return array("success" => true);
    }



    // Delete a storyboard
    public static function deleteStoryboard($user_id, $storyboard_id)
    {
        DB::beginTransaction();

        try {
            // Delete comment votes
            CommentVote::where("storyboard_id", $storyboard_id)->delete();

            // Delete comments
            Comment::where("storyboard_id", $storyboard_id)->delete();

            // Delete scenes
            Scene::where([
                ["storyboard_id", $storyboard_id],
                ["user_id", $user_id]
            ])->delete();

            // Delete storyboard
            Storyboard::where([
                ["storyboard_id", $storyboard_id],
                ["user_id", $user_id]
            ])->delete();

        } catch (Exception $e) {
            Log::info($e);
            DB::rollback();
            return array("success" => false, "message" => "Error deleting Storyboard");
        }

        DB::commit();
        return array("success" => true);
    }










    // ---------------------------------------- Scenes ----------------------------------------


    // Create a scene
    public static function createScene($user_id, $data)
    {
        $scene = null;
        DB::beginTransaction();

        try {
            $scene = Scene::create([
                "user_id" => $user_id,
                "storyboard_id" => $data["storyboard_id"],
                "storyboard_index" => $data["storyboard_index"],
                "type" => $data["type"],
            ]);

        } catch (Exception $e) {
            Log::info($e);
            DB::rollback();
            return array("success" => false, "message" => "Error creating Scene");
        }

        DB::commit();
        return array("success" => true, "data" => $scene->scene_id);
    }



    // Update scene canvas
    public static function updateSceneCanvas($data)
    {
        DB::beginTransaction();

        try {
            $scene = Scene::where("scene_id", $data["scene_id"])->first();

            $scene->image_name = $data["image_name"];
            $scene->canvas_data_json = $data["canvas_data_json"];
            $scene->canvas_data_svg = $data["canvas_data_svg"];
            $scene->save();

        } catch (Exception $e) {
            Log::info($e);
            DB::rollback();
            return array("success" => false, "message" => "Error updating Scene canvas");
        }

        DB::commit();
        return array("success" => true);
    }



    // Update scene text
    public static function updateSceneText($data)
    {
        DB::beginTransaction();

        try {
            $scene = Scene::where("scene_id", $data["scene_id"])->first();

            $scene->text = $data["text"];
            $scene->save();

        } catch (Exception $e) {
            Log::info($e);
            DB::rollback();
            return array("success" => false, "message" => "Error updating Scene text");
        }

        DB::commit();
        return array("success" => true);
    }



    // Update scene indicies
    public static function updateSceneIndicies($data)
    {
        DB::beginTransaction();
        try {

            $scene_id = null;
            $storyboard_index = null;

            // Update multiple records
            // top one from http://stackoverflow.com/a/5778265
            $query = "update scenes set storyboard_index = case scene_id";
            for ($i = 0; $i < count($data); $i++) {

                $scene_id = $data[$i]["scene_id"];
                $storyboard_index = $data[$i]["storyboard_index"];

                if (is_numeric($scene_id) == true && is_numeric($storyboard_index) == true) {
                    $query .= " when " . $scene_id . " then '" . $storyboard_index . "'";
                } else {
                    throw new Exception("Non numeric values in update Scene index parameters");
                }
            }

            $query .= " end where scene_id in (";

            for ($i = 0; $i < count($data); $i++) {
                $query .= $data[$i]["scene_id"] . ", ";
            }

            $query = substr($query, 0, -2);
            $query .= ")";

            DB::statement($query);

        } catch (Exception $e) {
            Log::info($e);
            DB::rollback();
            return array("success" => false, "message" => "Error updating Scene indicies");
        }

        DB::commit();
        return array("success" => true);
    }



    // Delete a scene
    public static function deleteScene($user_id, $data)
    {
        DB::beginTransaction();

        try {
            Scene::where([
                ["storyboard_id", $data["storyboard_id"]],
                ["storyboard_index", $data["storyboard_index"]],
                ["user_id", $user_id]
            ])->delete();

        } catch (Exception $e) {
            Log::info($e);
            DB::rollback();
            return array("success" => false, "message" => "Error deleting Scene");
        }

        DB::commit();
        return array("success" => true);
    }









    // ---------------------------------------- Comments ----------------------------------------



    // Get comments
    public static function getComments($storyboard_id)
    {
        //DB::enableQueryLog();
        $comments = DB::table("comments")
            ->join("users", "comments.user_id", "=", "users.user_id")
            ->select("comments.*", "users.username")
            ->where("storyboard_id", $storyboard_id)
            ->orderBy("comments.parent_id")
            ->orderBy("comments.created_at", "desc")
            ->get();

        //Log::info(DB::getQueryLog());
        return array("success" => true, "data" => array("comments" => $comments));
    }


    // Get comments and votes
    public static function getCommentsAndVotes($user_id, $storyboard_id)
    {
        $comments = Storyboards::getComments($storyboard_id)["data"]["comments"];

        $votes = DB::table("commentVotes")
            ->select("comment_id", "direction")
            ->where([
                ["user_id", $user_id],
                ["storyboard_id", $storyboard_id]
            ])
            ->get();

        return array("success" => true, "data" => array("comments" => $comments,
                                                        "votes" => $votes, "user_id" => $user_id));
    }


    // Make comment
    public static function makeComment($user_id, $data)
    {
        $comment = null;

        DB::beginTransaction();

        try {
            // create comment
            $comment = Comment::create([
                "storyboard_id" => $data["storyboard_id"],
                "user_id" => $user_id,
                "text" => $data["text"],
                "parent_id" => $data["parent_id"],
                "points" => 1
            ]);

            // add user vote on comment
            CommentVote::create([
                "comment_id" => $comment->comment_id,
                "storyboard_id" => $data["storyboard_id"],
                "user_id" => $user_id,
                "direction" => "u"
            ]);

            // increment storyboard comments
            DB::table("storyboards")
                ->where("storyboard_id", $data["storyboard_id"])
                ->increment("num_comments");
        } catch (Exception $e) {
            Log::info($e);
            DB::rollback();
            return array("success" => false, "message" => "Error creating comment");
        }

        DB::commit();

        $user = DB::table("users")
            ->select("username")
            ->where("user_id", $user_id)
            ->first();

        $returnData = array("username" => $user->username,
                            "comment_id" => $comment->comment_id,
                            "updated_at" => $comment->updated_at);

        return array("success" => true, "data" => $returnData);
    }



    // Update comment
    public static function updateComment($user_id, $data)
    {
        DB::beginTransaction();

        try {
            $comment = Comment::where("comment_id", $data["comment_id"])->first();
            $comment->text = $data["text"];
            $comment->save();

        } catch (Exception $e) {
            Log::info($e);
            DB::rollback();
            return array("success" => false, "message" => "Error updating comment");
        }

        DB::commit();
        return array("success" => true);
    }



    // Vote on comment (directions: u=up, d=down, n=noVote)
    public static function voteOnComment($user_id, $data)
    {
        DB::beginTransaction();

        $comment = null;

        // get previous direction for adding point to comments table
        $previousDirection = DB::table("commentVotes")
            ->select("direction")
            ->where([
                ["comment_id", $data["comment_id"]],
                ["user_id", $user_id]
            ])->get();


        // only update if vote has changed
        if ($previousDirection != $data["direction"]) {

            // keep track of comment so user can only vote once
            try {

                // insert new record if existing comment not found
                if (count($previousDirection) == 0) {
                    $previousDirection = "n";

                    CommentVote::create([
                        "comment_id" => $data["comment_id"],
                        "storyboard_id" => $data["storyboard_id"],
                        "user_id" => $user_id,
                        "direction" => $data["direction"]
                    ]);

                // update record if already exists
                } else {
                    $previousDirection = $previousDirection[0]->direction;

                    DB::update("UPDATE commentVotes SET direction = ? " .
                               "WHERE comment_id = ? AND user_id = ?",
                               [$data["direction"], $data["comment_id"], $user_id]);
                }

            } catch (Exception $e) {
                Log::info($e);
                DB::rollback();
                return array("success" => false, "message" => "Error voting on comment");
            }


            // add point to comment
            try {
                if ($data["direction"] == "d") {
                    $comment = DB::table("comments")
                        ->where("comment_id", $data["comment_id"])
                        ->decrement("points", $previousDirection == "u" ? 2 : 1);

                } else if ($data["direction"] == "u") {
                    $comment = DB::table("comments")
                        ->where("comment_id", $data["comment_id"])
                        ->increment("points", $previousDirection == "d" ? 2 : 1);

                } else if ($data["direction"] == "n") {
                    if ($previousDirection == "u") {
                        $comment = DB::table("comments")
                            ->where("comment_id", $data["comment_id"])
                            ->decrement("points");

                    } else if ($previousDirection == "d") {
                        $comment = DB::table("comments")
                            ->where("comment_id", $data["comment_id"])
                            ->increment("points");
                    }
                }

            } catch (Exception $e) {
                Log::info($e);
                DB::rollback();
                return array("success" => false, "message" => "Error voting on comment");
            }

            DB::commit();
        }


        $returnData = DB::table("comments")
            ->select("points")
            ->where("comment_id", $data["comment_id"])
            ->first();

        return array("success" => true, "data" => $returnData);
    }


    // Delete comment
    public static function deleteComment($user_id, $data)
    {
        DB::beginTransaction();

        try {
            // delete votes
            CommentVote::where("comment_id", $data["comment_id"])->delete();

            // mark comment as deleted and remove text/points
            $comment = Comment::where([
                ["comment_id", $data["comment_id"]],
                ["user_id", $user_id]
            ])->first();

            $comment->is_deleted = 1;
            $comment->text = "";
            $comment->points = 0;
            $comment->save();

        } catch (Exception $e) {
            Log::info($e);
            DB::rollback();
            return array("success" => false, "message" => "Error deleting comment");
        }

        DB::commit();
        return array("success" => true);
    }





    // ---------------------------------------- Other ----------------------------------------

    // Get storyboards titles for image
    public static function getStoryboardsForImage($user_id, $imageName)
    {
        $data = DB::table("scenes")
            ->join("storyboards", "scenes.storyboard_id", "=", "storyboards.storyboard_id")
            ->select("storyboards.title")
            ->where([
                ["scenes.user_id", $user_id],
                ["scenes.image_name", $imageName]
            ])
            ->distinct()
            ->get();

        $titles = json_decode(json_encode($data), true);

        if (count($titles) > 0) {
            $result = [];
            for ($i = 0; $i < count($titles); $i++) {
                array_push($result, $titles[$i]["title"]);
            }

            return array("success" => true, "data" => array("linked" => true, "titles" => $result));
        } else {
            return array("success" => true, "data" => array("linked" => false));
        }
    }



}
