<?php

namespace App\Http\Controllers;

use DB;
use Log;
use Auth;
use Imagick;
use GuzzleHttp;
use App\Other\Util;
use App\Other\Azure;
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
        $result = Azure::getImageThumbnailFiles(Auth::user()->user_id);

        // TODO : error check
        return array("success" => true, "data" => $result);

    }



    // Upload an image to azure blob storage
    public function uploadImage(Request $request)
    {
        $image = $request->file("files")[0];

        // create file name
        $time = str_replace(".", "", microtime(true) . "");
        $imageFileName = $time . "." . $image->getClientOriginalExtension();

        if ($request->hasFile("files"))
        {
            if ($request->file("files")[0]->isValid())
            {
                $image = $request->file("files")[0];
                $result = Azure::uploadImage(Auth::user()->user_id, $imageFileName, $image);

                if ($result == true)
                {
                    return array("success" => true, "data" => $result);
                }
                else
                {
                    return array("success" => false, "message" => "Error uploading image");
                }
            }
            else
            {
                return array("success" => false, "message" => "file invalid");
            }
        }
        else
        {
            return array("success" => false, "message" => "file missing");
        }
    }



    // get image from url of another website and save to azure
    public function uploadImageFromUrl(Request $request)
    {
        // validate file extension
        $path_parts = pathinfo($request->url);
        $ext = $path_parts["extension"];
        if ($ext == "jpg" || $ext == "jpeg" || $ext == "gif" || $ext == "png")
        {
            // create file name
            $time = str_replace(".", "", microtime(true) . "");
            $imageFileName = $time . "." . $ext;

            try
            {
                // check file isn't too big
                $head = array_change_key_case(get_headers($request->url, TRUE));
                $filesize = $head['content-length'];

                if ($filesize <= 500000)
                {
                    // upload file to azure
                    $result = Azure::uploadImage(Auth::user()->user_id, $imageFileName, $request->url);

                    if ($result == true)
                    {
                        return array("success" => true, "data" => $result);
                    }
                    else
                    {
                        return array("success" => false, "message" => "Error uploading image");
                    }
                }
                else
                {
                    return array("success" => false, "message" => "File is too big.  500kB limit");
                }
            }
            catch (Exception $e)
            {
                return array("success" => false, "message" => "Could not download file from this url");
            }
        }
        else
        {
            return array("success" => false, "message" => "Invalid file extension");
        }
    }



    // Update an existing image
    public function updateImage(Request $request)
    {
        // Crop and save image
        $path = base_path() . "/public/tempImages/" . $request->imageName;
        Util::base64ToImage($request->imageString, $path);

        $image = new Imagick($path);
        $image->cropImage($request->cropData["width"], $request->cropData["height"],
                          $request->cropData["x"], $request->cropData["y"]);
        $image->writeImage($path);

        // upload to azure
        $result = Azure::uploadImage(Auth::user()->user_id, $request->imageName, $path);

        // delete temp file
        Util::deleteTemporaryFile($request->imageName);

        if ($result == true)
        {
            return array("success" => true, "data" => $result);
        }
        else
        {
            return array("success" => false, "message" => "Error updating image");
        }
    }



    // Delete an image from the temporary folder
    public function deleteTempImage(Request $request)
    {
        $result = Util::deleteTemporaryFile($request->imageName);
        if ($result == true)
        {
            return array("success" => true, "data" => $result);
        }
        else
        {
            return array("success" => false, "message" => "Error deleting temp image");
        }
    }



    // Delete image from azure
    public function deleteImage(Request $request)
    {
        $result = Azure::deleteImage(Auth::user()->user_id, $request->imageName);
        if ($result == true)
        {
            return array("success" => true, "data" => $result);
        }
        else
        {
            return array("success" => false, "message" => "Error deleting image");
        }
    }


    // get image from azure (private images version) - required for html canvas
    public function imageProxy($imageName)
    {
        $url = "http://shoterate.blob.core.windows.net/user" . Auth::user()->user_id . "/" . $imageName;
        $client = new GuzzleHttp\Client();
        $res = $client->get($url);
        return $res->getBody();
    }

}
