<?php

namespace App\Http\Controllers\Api;

use DB;
use Log;
use Auth;
use Validator;
use App\Other\Util;
use App\Other\Azure;
use App\Models\User;
use App\Http\Requests;
use App\Other\Accounts;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ApiAccountController extends Controller
{

    public function __construct()
    {

    }




    // -------------------------------------- Don't require token --------------------------------------


    // Login a user, return api_token
    public function login(Request $request)
    {
        // validate inputs
        $validator = Validator::make($request->data, [
            "email" => "required|email|min:4|max:255",
            "password" => "required|min:6"
        ]);


        if ($validator->fails()) {
            // return just the first error
            $error = json_decode($validator->errors(), true);
            return array("success" => false, "message" => reset($error)[0]);

        } else {
            // Login user and return api_token
            if (Auth::attempt(array("email" => $request->data["email"],
                                    "password" => $request->data["password"]))) {
                return array("success" => true, "data" => Auth::user()->api_token);

            } else {
                return array("success" => false, "message" => "Incorrect credentials");
            }
        }
    }



    // Register a user, return api_token
    public function register(Request $request)
    {
        $data = $request->data;

        // validate inputs
        $validator = Validator::make($data, [
            "username" => "required|min:3|max:30|unique:users",
            "email" => "required|email|min:4|max:255|unique:users",
            "password" => "required|min:6",
        ]);


        if ($validator->fails()) {
            // return just the first error
            $error = json_decode($validator->errors(), true);
            return array("success" => false, "message" => reset($error)[0]);

        } else {
            // Create new user in database
            $guid = Util::getGUID();
            DB::beginTransaction();

            $newUser = User::create([
                "username" => $data["username"],
                "email" => $data["email"],
                "password" => bcrypt($data["password"]),
                "last_login" => Util::getCurrentDateTime(),
                "api_token" => $guid
            ]);

            // Create a container for user images
            $success = Azure::createContainer($newUser->user_id);

            if ($success == false) {
                DB::rollBack();
                return array("success" => false, "message" => "Error creating new user");
            } else {
                DB::commit();
                return array("success" => true, "data" => $guid);
            }
        }
    }





    // ---------------------------------------- Require token ----------------------------------------


    // Check if user is logged in using api_token
    public function userIsLoggedIn ($api_token)
    {
        $user_id = Util::getUserIdFromApiToken($api_token);
        if ($user_id === null) {
            return Util::getInvalidApiTokenResponse();
        } else {
            return array("success" => true);
        }
    }


    // Get user account details
    public function getAccountDetails ($api_token)
    {
        // TODO - probably shouldn't return token from here
        $data = User::where("api_token", $api_token)->get();
        if ($data === null || count($data) == 0) {
            return Util::getInvalidApiTokenResponse();
        } else {
            return array("success" => true, "data" => $data[0]);
        }
    }


    // Change user password
    public function changePassword(Request $request)
    {
        $user_id = Util::getUserIdFromApiToken($request->data["api_token"]);
        if ($user_id === null) {
            return Util::getInvalidApiTokenResponse();
        } else {
            return Accounts::changePassword($user_id, $request->data);
        }
    }


    // Update user account details
    public function updateAccount(Request $request)
    {
        $user_id = Util::getUserIdFromApiToken($request->data["api_token"]);
        if ($user_id === null) {
            return Util::getInvalidApiTokenResponse();
        } else {
            return Accounts::updateAccount($user_id, $request->data);
        }
    }


    // Disable user account
    public function disableAccount($api_token)
    {
        $success = User::where("api_token", $api_token)->update(["is_active" => 0]);
        if ($success == 1) {
            return array("success" => true);
        } else {
            return Util::getInvalidApiTokenResponse();
        }
    }


    // Enable user account
    public function enableAccount($api_token)
    {
        $success = User::where("api_token", $api_token)->update(["is_active" => 1]);
        if ($success == 1) {
            return array("success" => true);
        } else {
            return Util::getInvalidApiTokenResponse();
        }
    }


    // Logout - regenerate api_token
    public function logout($api_token)
    {
        $guid = Util::getGUID();
        $success = DB::table("users")
            ->where("api_token", $api_token)
            ->update(["api_token" => $guid]);

        if ($success == 1) {
            return array("success" => true);
        } else {
            return Util::getInvalidApiTokenResponse();
        }
    }


    // Delete a user
    public function deleteAccount ($api_token)
    {
        $user_id = Util::getUserIdFromApiToken($api_token);
        if ($user_id === null) {
            Util::getInvalidApiTokenResponse();
        } else {
            return Accounts::deleteUser($user_id);
        }
    }



}
