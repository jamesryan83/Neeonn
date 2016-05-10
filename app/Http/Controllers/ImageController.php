<?php

namespace App\Http\Controllers;

use DB;
use Log;
use Auth;
use GuzzleHttp;
use App\Other\Util;
use App\Other\Azure;
use App\Other\Accounts;
use App\Other\Storyboards;
use App\Http\Requests;
use Illuminate\Http\Request;



class ImageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }



    // Get images for gallery
    public function getGalleryImages()
    {
        $user_id = Auth::user()->user_id;

        $images = Azure::getImageThumbnailFiles($user_id);
        $imageOrder = DB::table("users")
            ->select("gallery_order")
            ->where("user_id", $user_id)
            ->first();

        return array("success" => true, "data" => array(
            "images" => $images,
            "order" => $imageOrder->gallery_order
        ));
    }



    // Upload an image to azure blob storage
    public function uploadImage(Request $request)
    {
        $image = $request->file("files")[0];

        // create file name
        $time = str_replace(".", "", microtime(true) . "");
        $imageFileName = $time . "." . $image->getClientOriginalExtension();

        if ($request->hasFile("files")) {
            if ($request->file("files")[0]->isValid()) {

                $image = $request->file("files")[0];
                $result = Azure::uploadImage(Auth::user()->user_id, $imageFileName, $image);

                if ($result == true) {
                    return array("success" => true, "data" => $result);
                } else {
                    return array("success" => false, "message" => "Error uploading image");
                }

            } else {
                return array("success" => false, "message" => "file invalid");
            }
        } else         {
            return array("success" => false, "message" => "file missing");
        }
    }



    // get image from url of another website and save to azure
    public function uploadImageFromUrl(Request $request)
    {
        // validate file extension
        $path_parts = pathinfo($request->url);
        $ext = strtolower($path_parts["extension"]);
        if ($ext == "jpg" || $ext == "jpeg" || $ext == "gif" || $ext == "png") {

            // create file name
            $time = str_replace(".", "", microtime(true) . "");
            $imageFileName = $time . "." . $ext;

            try {
                // check file isn't too big
                $head = array_change_key_case(get_headers($request->url, TRUE));
                if (array_key_exists("content-length", $head) == false) {
                    return array("success" => false, "message" =>
                                 "Not allowed to download file from this url");
                }

                if ($head["content-length"] <= 1000000) {
                    // upload file to azure
                    $result = Azure::uploadImage(Auth::user()->user_id, $imageFileName, $request->url);

                    if ($result == true) {
                        return array("success" => true, "data" => $result);
                    } else {
                        return array("success" => false, "message" => "Error uploading image");
                    }

                } else {
                    return array("success" => false, "message" => "File is too big.  1MB limit");
                }
            } catch (Exception $e) {
                return array("success" => false, "message" => "Could not download file from this url");
            }
        } else {
            return array("success" => false, "message" => "Invalid file extension");
        }
    }


    // Get storyboards titles for image
    public function getStoryboardsForImage(Request $request)
    {
        return Storyboards::getStoryboardsForImage(Auth::user()->user_id, $request->imageName);
    }


    // Delete image from azure
    public function deleteImage(Request $request)
    {
        $result = Azure::deleteImage(Auth::user()->user_id, $request->imageName);
        if ($result == true) {
            return array("success" => true, "data" => $result);
        } else {
            return array("success" => false, "message" => "Error deleting image");
        }
    }


    // Update gallery order
    public function updateGalleryOrder(Request $request)
    {
        return Accounts::updateGalleryOrder(Auth::user()->user_id, $request->data);
    }







    // get image from azure (private images version) - required for html canvas
    public function imageProxy($imageName)
    {
        try {
            $url = Util::getBlobHostUrl() . "user" . Auth::user()->user_id . "/" . $imageName;
            $client = new GuzzleHttp\Client();
            $res = $client->get($url);
            return $res->getBody();

        } catch (ConnectException $e) {
            Log::info("image-proxy error");
            Log::info($e->getMessage());
            return $e->getRequest();
        }
    }

}
