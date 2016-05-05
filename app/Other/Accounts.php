<?php

namespace App\Other;

use Log;
use DB;
use Validator;
use App\Other\Azure;
use App\Models\User;
use App\Models\Scene;
use App\Models\Storyboard;
use Illuminate\Support\Facades\Hash;


class Accounts
{

    // Change password
    public static function changePassword($user_id, $data)
    {
        $validator = Validator::make($data, [
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
        $password = User::where("user_id", $user_id)->value("password");
        if (!Hash::check($data["oldPassword"], $password))
        {
            return array("success" => false, "message" => "Old password is incorrect");
        }
        else
        {
            // update password
            $success = User::where("user_id", $user_id)->update([
                "password" => Hash::make($data["newPassword"]),
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


    // Update Account
    public static function updateAccount($user_id, $data)
    {
        $validator = Validator::make($data, [
            "fullname" => "max:100",
            "username" => "required|min:3|max:30|unique:users,username," . $user_id . ",user_id",
            "email" => "required|email|min:4|max:255|unique:users,email," . $user_id . ",user_id",
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
            $success = User::where("user_id", $user_id)->update([
                "fullname" => $data["fullname"],
                "username" => $data["username"],
                "email" => $data["email"],
                "website" => $data["website"],
                "location" => $data["location"],
                "summary" => $data["summary"],
            ]);

            if ($success == 1)
            {
                return array("success" => true, "data" => "account updated");
            }
            else
            {
                return array("success" => false, "message" => "Error updating account");
            }
        }
    }





    // Delete a user, their storyboards and azure storage
    public static function deleteUser($user_id)
    {
        // TODO : don't use simple transactions
        // Delete user and storyboards/scenes
        $success = 0;
        DB::transaction(function () use (&$success, $user_id)
        {
            Scene::where("user_id", $user_id)->delete();
            Storyboard::where("user_id", $user_id)->delete();
            $success = User::destroy($user_id);
        });

        // delete azure container
        Azure::deleteContainer($user_id);

        if ($success == 1)
        {
            return array("success" => true, "data" => "account deleted");
        }
        else
        {
            return array("success" => false, "message" => "Error deleting account");
        }
    }




    // Update gallery order
    public static function updateGalleryOrder($user_id, $gallery_order)
    {
        DB::beginTransaction();

        $result = 0;

        try {
            $result = DB::table("users")
                ->where("user_id", $user_id)
                ->update(["gallery_order" => $gallery_order]);
        } catch (Exception $e) {
            Log::info($e);
            DB::rollback();
        }

        if ($result === 1) {
            DB::commit();
            return array("success" => true);
        } else {
            return array("success" => false, "message" => "Error updating gallery order");
        }
    }

}
