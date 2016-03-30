<?php

namespace App\Http\Controllers\Auth;

use Log;
use App\Other\Util;
use App\Other\Azure;
use App\Models\User;
use Validator;
use DB;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;

class AuthController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Registration & Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users, as well as the
    | authentication of existing users. By default, this controller uses
    | a simple trait to add these behaviors
    |
    */

    use AuthenticatesAndRegistersUsers, ThrottlesLogins;

    protected $redirectTo = "/public/latest";

    public function __construct()
    {
        $this->middleware($this->guestMiddleware(), ["except" => "logout"]);
    }

    protected function validator(array $data)
    {
        return Validator::make($data, [
            "username" => "required|min:3|max:30|unique:users",
            "email" => "required|email|min:4|max:255|unique:users",
            "password" => "required|min:6",
        ]);
    }

    // Creates a new user
    protected function create(array $data)
    {
        DB::beginTransaction();
        $newUser = User::create([
            "username" => $data["username"],
            "email" => $data["email"],
            "password" => bcrypt($data["password"]),
            "last_login" => Util::getCurrentDateTime(),
            "api_token" => Util::getGUID()
        ]);

        // Create a container for user images
        $success = Azure::createContainer($newUser->user_id);

        if ($success == false)
        {
            DB::rollBack();
            abort(500); // show 500 page
        }
        else
        {
            DB::commit();
            return $newUser;
        }


    }
}
