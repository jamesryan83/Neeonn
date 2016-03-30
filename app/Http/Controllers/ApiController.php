<?php

namespace App\Http\Controllers;

use DB;
use Log;
use Auth;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class ApiController extends Controller
{

    // insert image into databse
    public function imageUpload(Request $request)
    {
        $datetime = date("Y-m-d H:i:s");

//        $success = DB::table("images")->insert([
//            "user_id" => Auth::guard('api')->user()->id,
//            "image_data" => $request->data,
//            "created_at" => $datetime
//        ]);

        echo $success == 1 ? "true" : "false";
    }
}
