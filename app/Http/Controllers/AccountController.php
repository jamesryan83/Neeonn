<?php

namespace App\Http\Controllers;

use DB;
use App\Models\Scene;
use App\Models\Storyboard;
use Log;
use Auth;
use Validator;
use Hash;
use App\Other\Azure;
use App\Http\Requests;
use App\Models\User;
use Illuminate\Http\Request;

class AccountController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }


    // Update Account
    public function updateAccount(Request $request)
    {
        $request = $request->data;
        $validator = Validator::make($request, [
            "fullname" => "max:100",
            "username" => "required|min:3|max:30|unique:users,username," . Auth::user()->user_id . ",user_id",
            "email" => "required|email|min:4|max:255|unique:users,email," . Auth::user()->user_id . ",user_id",
            "website" => "max:2083",
            "location" => "max:255",
            "summary" => "max:255"
        ]);

        if ($validator->fails())
        {
            // return just the first error
            $error = json_decode($validator->errors(), true);
            return array("success" => false, "message" => reset($error)[0]);
        }
        else
        {
            $success = User::where("user_id", Auth::user()->user_id)->update([
                "fullname" => $request["fullname"],
                "username" => $request["username"],
                "email" => $request["email"],
                "website" => $request["website"],
                "location" => $request["location"],
                "summary" => $request["summary"],
            ]);

            return array("success" => true, "data" => "account updated");
        }
    }


    // Disable Account
    public function disableAccount()
    {
        $success = User::where("user_id", Auth::user()->user_id)->update(["is_active" => 0]);
        if ($success == 1)
        {
            return array("success" => true, "data" => "account disabled");
        }
        else
        {
            return array("success" => false, "message" => "Error disabling account");
        }
    }


    // Enable Account
    public function enableAccount()
    {
        $success = User::where("user_id", Auth::user()->user_id)->update(["is_active" => 1]);
        if ($success == 1)
        {
            return array("success" => true, "data" => "account enabled");
        }
        else
        {
            return array("success" => false, "message" => "Error enabling account");
        }
    }


    // Delete Account
    public function deleteAccount()
    {
        $success = 0;
        $userId = Auth::user()->user_id;

        DB::transaction(function () use (&$success, $userId)
        {
            Scene::where("user_id", $userId)->delete();
            Storyboard::where("user_id", $userId)->delete();
            $success = User::destroy($userId);
        });

        Azure::deleteContainer($userId);

        if ($success == 1)
        {
            return array("success" => true, "data" => "account deleted");
        }
        else
        {
            return array("success" => false, "message" => "Error deleting account");
        }
    }


    // Change password
    public function changePassword(Request $request)
    {
        $request = $request->data;
        $validator = Validator::make($request, [
            "oldPassword" => "required|min:6",
            "newPassword" => "required|min:6|confirmed"
        ]);

        if ($validator->fails())
        {
            // return just the first error
            $error = json_decode($validator->errors(), true);
            return array("success" => false, "message" => reset($error)[0]);
        }


        // Check password is correct for user
        $password = User::where("user_id", Auth::user()->user_id)->value("password");
        if (!Hash::check($request["oldPassword"], $password))
        {
            return array("success" => false, "message" => "Old password is incorrect");
        }
        else
        {
            // update password
            $success = User::where("user_id", Auth::user()->user_id)->update([
                "password" => Hash::make($request["newPassword"]),
            ]);

            if ($success == 1)
            {
                return array("success" => true, "data" => "password changed");
            }
            else
            {
                return array("success" => false, "message" => "Error changing password");
            }
        }

    }
}
