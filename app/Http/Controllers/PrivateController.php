<?php

namespace App\Http\Controllers;

use DB;
use Log;
use Auth;
use App\Http\Requests;
use Illuminate\Http\Request;
use WindowsAzure\Common\ServicesBuilder;
use App\Other\Util;
use App\Other\Azure;

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

    public function getEditStoryboardPage($storyboardId)
    {
        return view("editStoryboard", ["storyboardId" => $storyboardId]);
    }

    public function getEditImagePage($imageName)
    {
        $imageUrl = Util::createTemporaryImageForEditing(Auth::user()->user_id, $imageName);
        return view("editImage", ["url" => $imageUrl]);
    }

}
