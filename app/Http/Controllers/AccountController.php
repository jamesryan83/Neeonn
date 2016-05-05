<?php

namespace App\Http\Controllers;

use Log;
use Auth;
use App\Models\User;
use App\Other\Accounts;
use App\Http\Requests;
use Illuminate\Http\Request;

class AccountController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }



    // ---------------------------------------- Website Functions ----------------------------------------

    // Update Account
    public function updateAccount(Request $request)
    {
        return Accounts::updateAccount(Auth::user()->user_id, $request->data);
    }


    // Disable Account
    public function disableAccount()
    {
        $success = User::where("user_id", Auth::user()->user_id)->update(["is_active" => 0]);
        if ($success == 1) {
            return array("success" => true, "data" => "account disabled");
        } else {
            return array("success" => false, "message" => "Error disabling account");
        }
    }


    // Enable Account
    public function enableAccount()
    {
        $success = User::where("user_id", Auth::user()->user_id)->update(["is_active" => 1]);
        if ($success == 1) {
            return array("success" => true, "data" => "account enabled");
        } else {
            return array("success" => false, "message" => "Error enabling account");
        }
    }


    // Delete Account
    public function deleteAccount()
    {
        return Accounts::deleteUser(Auth::user()->user_id);
    }


    // Change password
    public function changePassword(Request $request)
    {
        return Accounts::changePassword(Auth::user()->user_id, $request->data);
    }
}
