<?php

namespace App\Other;

class Util
{
    // Create a GUID (api_token)
    // http://stackoverflow.com/a/18206984
    public static function getGUID()
    {
        if (function_exists('com_create_guid'))
        {
            return com_create_guid();
        }
        else
        {
            mt_srand((double) microtime() * 10000);
            $charid = strtoupper(md5(uniqid(rand(), true)));
            $hyphen = chr(45);
            $uuid = substr($charid, 0, 8).$hyphen
                .substr($charid, 8, 4).$hyphen
                .substr($charid,12, 4).$hyphen
                .substr($charid,16, 4).$hyphen
                .substr($charid,20,12);

            return $uuid;
        }
    }


    // Returns the current date/time for sql
    public static function getCurrentDateTime()
    {
        return date("Y-m-d H:i:s.0000000");
    }


    // Returns an Azure blob url
    public static function getBlobUrl($userId, $imageName)
    {
        return "https://shoterate.blob.core.windows.net/user" . $userId . "/" . $imageName;
    }




    // Create a temporary file for editing in the tempImages folder
    public static function createTemporaryImageForEditing($userId, $imageName)
    {
        $blobUrl = Util::getBlobUrl($userId, $imageName);
        $image = file_get_contents($blobUrl);
        file_put_contents("tempImages/" . $imageName, $image);
        return "tempImages/" . $imageName;
    }



    // Delete a temporary file from the tempImages folder
    public static function deleteTemporaryFile($fileName)
    {
        $success = unlink("tempImages/" . $fileName);
        return array("success" => $success);
    }



    // Base64 string to image
    public static function base64ToImage($base64_string, $output_file) {
        $ifp = fopen($output_file, "wb");

        $data = explode(',', $base64_string);

        fwrite($ifp, base64_decode($data[1]));
        fclose($ifp);

        return $output_file;
    }

}
