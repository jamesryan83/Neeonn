<?php

namespace App\Http\Controllers;

use Log;
use Auth;
use App\Http\Requests;
use Illuminate\Http\Request;

class PrivateController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function getAccountStoryboardsPage()
    {
        return view("accountStoryboards");
    }

    public function getAccountGalleryPage()
    {
        return view("accountGallery");
    }

    public function getAccountSocialPage()
    {
        return view("accountSocial");
    }

    public function getAccountSettingsPage()
    {
        return view("accountSettings", ["user" => Auth::user()]);
    }

    public function getAccountChangePasswordPage()
    {
        return view("auth/passwordChange");
    }

    public function getEditStoryboardPage($storyboard_id)
    {
        return view("editStoryboard", ["storyboard_id" => $storyboard_id]);
    }

}
