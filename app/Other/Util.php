<?php

namespace App\Other;

use DB;

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
            $uuid = substr($charid, 0, 8) . $hyphen
                . substr($charid, 8, 4) . $hyphen
                . substr($charid,12, 4) . $hyphen
                . substr($charid,16, 4) . $hyphen
                . substr($charid,20,12);

            return $uuid;
        }
    }


    // Returns the current date/time for sql
    public static function getCurrentDateTime()
    {
        return date("Y-m-d H:i:s.0000000");
    }


    // Returns an Azure blob url
    public static function getBlobUrl($user_id, $imageName)
    {
        return Util::getBlobHostUrl() . "user" . $user_id . "/" . $imageName;
    }


    // Returns either production or debug host url for blob storage
    public static function getBlobHostUrl()
    {
        // DEBUGmode
//        return "http://127.0.0.1:10000/devstoreaccount1/";
        return "http://shoterate.blob.core.windows.net/";
    }


    // Get the current users id from an api_token
    public static function getUserIdFromApiToken($api_token)
    {
        $users = DB::table("users")->where("api_token", $api_token)->select("user_id")->get();
        if (count($users) > 0)
        {
            return $user_id = $users[0]->user_id;
        }
        else
        {
            return null;
        }
    }


    // Return response for api key
    public static function getInvalidApiTokenResponse()
    {
        return array("success" => false, "message" => "Invalid api_token");
    }



}
