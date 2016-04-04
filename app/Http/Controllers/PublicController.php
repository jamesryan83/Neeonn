<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Auth;
use Log;
use DB;
use Validator;
use GuzzleHttp;
use App\Other\Util;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class PublicController extends Controller
{

    // ----------------------------  User Functions  ----------------------------
    // public api routes

    // Check if user is logged in using api_token
    public function userLoggedIn (Request $request)
    {
        // check if valid guid
        if (preg_match("/^[a-zA-Z0-9-]+$/", $request->api_token))
        {
            // find user
            $users = DB::table("users")->where("api_token", $request->api_token)->first();

            if (count($users) > 0)
            {
                echo "true";
            }
            else
            {
                echo "false";
            }
        }
        else
        {
            echo "false";
        }
    }



    // Login a user, return api_token
    public function loginUser(Request $request)
    {
        // validate inputs
        $validator = Validator::make($request->all(), [
            "email" => "required|email|min:4|max:255",
            "password" => "required|min:6"
        ]);


        if ($validator->fails())
        {
            echo $validator->errors();
        }
        else
        {
            // Login user and return api_token
            if (Auth::attempt(array("email" => $request->email, "password" => $request->password)))
            {
                $response = array("api_token" => Auth::user()->api_token);

                echo json_encode($response);
            }
            else
            {
                echo "false";
            }
        }
    }



    // Register a user, return api_token
    public function registerUser(Request $request)
    {
        // validate inputs
        $validator = Validator::make($request->all(), [
            "username" => "required|min:3|max:30|unique:users",
            "email" => "required|email|min:4|max:255|unique:users",
            "password" => "required|min:6",
        ]);


        if ($validator->fails()) {
            echo $validator->errors();
        } else {

            $datetime = date("Y-m-d H:i:s");

            // insert new user into DB and return api_token ($guid)
            $guid = Util::getGUID();

            $success = DB::table("users")->insert([
                "username" => $request->username,
                "email" => $request->email,
                "password" => bcrypt($request->password),
                "api_token" => $guid
            ]);

            echo $success == 1 ? $guid : "false";
        }
    }









    // ----------------------------  Public Page Functions  ----------------------------


    // returns the home page
    public function getHomePage()
    {
        if (Auth::check())
        {
            return redirect("search");
        }
        else
        {
            return view("home");
        }
    }


    // Search page
    public function getSearchPage()
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




    // ----------------------------  Public Image Proxy  ----------------------------


    // get image from azure (public images version) - required for html canvas
    public function imageProxyPublic($userId, $imageName)
    {
        $url = "http://shoterate.blob.core.windows.net/user" . $userId . "/" . $imageName;
        $client = new GuzzleHttp\Client();
        $res = $client->get($url);
        return $res->getBody();
    }
}
