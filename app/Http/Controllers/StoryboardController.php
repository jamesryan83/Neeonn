<?php

namespace App\Http\Controllers;

use Log;
use Auth;
use App\Other\Storyboards;
use App\Http\Requests;
use Illuminate\Http\Request;



class StoryboardController extends Controller
{
    public function __construct()
    {

    }





    // ---------------------------------------- Storyboards ----------------------------------------


    // Get a single storyboard and its scenes
    public function getStoryboard(Request $request)
    {
        if (Auth::check()) {
            return Storyboards::getStoryboard($request->storyboard_id, true);
        } else {
            return Storyboards::getStoryboard($request->storyboard_id, false);
        }
    }


    // Get all storyboards
    public function getAllStoryboards()
    {
        if (Auth::check()) {
            return Storyboards::getAllStoryboards(Auth::user());
        } else {
            return array("success" => false, "message" => "unauthorized");
        }
    }


    // Create a storyboard
    public function createStoryboard(Request $request)
    {
        if (Auth::check()) {
            return Storyboards::createStoryboard(Auth::user()->user_id, $request->data);
        } else {
            return array("success" => false, "message" => "unauthorized");
        }
    }


    // Update storyboard details
    public function updateStoryboardDetails(Request $request)
    {
        if (Auth::check()) {
            return Storyboards::updateStoryboardDetails(Auth::user()->user_id, $request->data);
        } else {
            return array("success" => false, "message" => "unauthorized");
        }
    }


    // Delete a storyboard
    public function deleteStoryboard(Request $request)
    {
        if (Auth::check()) {
            return Storyboards::deleteStoryboard(Auth::user()->user_id, $request->storyboard_id);
        } else {
            return array("success" => false, "message" => "unauthorized");
        }
    }








    // ---------------------------------------- Scenes ----------------------------------------


    // Create Scene
    public function createScene(Request $request)
    {
        if (Auth::check()) {
            return Storyboards::createScene(Auth::user()->user_id, $request->data);
        } else {
            return array("success" => false, "message" => "unauthorized");
        }
    }


    // Update scene canvas
    public function updateSceneCanvas(Request $request)
    {
        if (Auth::check()) {
            return Storyboards::updateSceneCanvas($request->data);
        } else {
            return array("success" => false, "message" => "unauthorized");
        }
    }


    // Update scene text
    public function updateSceneText(Request $request)
    {
        if (Auth::check()) {
            return Storyboards::updateSceneText($request->data);
        } else {
            return array("success" => false, "message" => "unauthorized");
        }
    }


    // Update scene indicies
    public function updateSceneIndicies(Request $request)
    {
        if (Auth::check()) {
            return Storyboards::updateSceneIndicies($request->data);
        } else {
            return array("success" => false, "message" => "unauthorized");
        }
    }



     // Delete Scene
    public function deleteScene(Request $request)
    {
        if (Auth::check()) {
            return Storyboards::deleteScene(Auth::user()->user_id, $request->data);
        } else {
            return array("success" => false, "message" => "unauthorized");
        }
    }





    // ---------------------------------------- Comments ----------------------------------------


    // Get comments for a storyboard
    public function getComments(Request $request)
    {
        if (Auth::check()) {
            return Storyboards::getCommentsAndVotes(Auth::user()->user_id, $request->storyboard_id);
        } else {
            return Storyboards::getComments($request->storyboard_id);
        }
    }


    // Make a comment on a storyboard
    public function makeComment(Request $request)
    {
        if (Auth::check()) {
            return Storyboards::makeComment(Auth::user()->user_id, $request->data);
        } else {
            return array("success" => false, "message" => "unauthorized");
        }
    }


    // Update storyboard comment
    public function updateComment(Request $request)
    {
        if (Auth::check()) {
            return Storyboards::updateComment(Auth::user()->user_id, $request->data);
        } else {
            return array("success" => false, "message" => "unauthorized");
        }
    }


    // Vote on comment
    public function voteOnComment(Request $request)
    {
        if (Auth::check()) {
            return Storyboards::voteOnComment(Auth::user()->user_id, $request->data);
        } else {
            return array("success" => false, "message" => "unauthorized");
        }
    }


}
