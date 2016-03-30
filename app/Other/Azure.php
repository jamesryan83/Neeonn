<?php

namespace App\Other;

use Log;
use Imagick;
use WindowsAzure\Common\ServicesBuilder;
use WindowsAzure\Blob\Models\CreateContainerOptions;
use WindowsAzure\Blob\Models\CreateBlobOptions;
use WindowsAzure\Blob\Models\PublicAccessType;
use WindowsAzure\Blob\Models\GetBlobPropertiesResult;
use WindowsAzure\Blob\Models\GetBlobMetadataResult;
use WindowsAzure\Common\ServiceException;



class Azure
{

    // -------------------------------- Blob storage functions --------------------------------

    private static function getConnectionString()
    {
        return "DefaultEndpointsProtocol=https;" .
            "AccountName=shoterate;" .
            "AccountKey=88Id5x/G1nHMCHjmT0R6pvcB0cSfaRT1un28cS6wz6O/I+fY7" .
            "4WaPCStUxNjBsyjZCBRL7scNsneNd2kg63sTg==;";
    }



    // Create a Container for a User
    public static function createContainer($userId)
    {
        $containerName = "user" . $userId;

        $createContainerOptions = new CreateContainerOptions();
        $createContainerOptions->setPublicAccess(PublicAccessType::BLOBS_ONLY);

        try
        {
            $blobRestProxy = ServicesBuilder::getInstance()->createBlobService(Azure::getConnectionString());
            $blobRestProxy->createContainer($containerName, $createContainerOptions);
            return true;
        }
        catch(ServiceException $e)
        {
            $code = $e->getCode();
            $error_message = $e->getMessage();
            Log::info($code.": ".$error_message);
            return $e;
        }
    }



    // Delete a Container for a User
    public static function deleteContainer($userId)
    {
        $containerName = "user" . $userId;

        try
        {
            $blobRestProxy = ServicesBuilder::getInstance()->createBlobService(Azure::getConnectionString());
            $blobRestProxy->deleteContainer($containerName);
            return true;
        }
        catch(ServiceException $e)
        {
            $code = $e->getCode();
            $error_message = $e->getMessage();
            Log::info($code.": ".$error_message);
            return false;
        }
    }



    // Get all image thumbnails from a container
    public static function getImageThumbnailFiles($userId)
    {
        $containerName = "user" . $userId;

        try
        {
            $blobRestProxy = ServicesBuilder::getInstance()->createBlobService(Azure::getConnectionString());
            $blob_list = $blobRestProxy->listBlobs($containerName);
            $blobs = $blob_list->getBlobs();

            // get blob lastmodified dates
            $fileArray = array();
            foreach($blobs as $blob)
            {
                if (strpos($blob->getUrl(), "thumb_") !== false)
                {
                    $temp = array("filename" => $blob->getName(),
                              "url_thumb" => $blob->getUrl(),
                              "lastModified" =>
                             $blob->getProperties()->getLastModified()->format('Y-m-d H:i:s'));
                    array_push($fileArray, $temp);
                }
            }

            // sort results by date with newest first
            usort($fileArray, function($a, $b) {
                return $a['lastModified'] - $b['lastModified'];
            });

            return $fileArray;
        }
        catch(ServiceException $e)
        {
            $code = $e->getCode();
            $error_message = $e->getMessage();
            Log::info($code.": ".$error_message);
            return false;
        }
    }



    // Upload image
    public static function uploadImage($userId, $imageFileName, $image)
    {
        $containerName = "user" . $userId;

        try
        {
            // send file to azure blob storage
            $imageData = file_get_contents($image);
            $blobRestProxy = ServicesBuilder::getInstance()->createBlobService(Azure::getConnectionString());
            $blobRestProxy->createBlockBlob($containerName, $imageFileName, $imageData);

            // create thumbnail and also send to azure
            $thumb = new Imagick();
            $thumb->readImageBlob($imageData);
            $thumb->thumbnailImage (110, 110, true);
            $blobRestProxy->createBlockBlob($containerName, "thumb_" . $imageFileName,
                                            $thumb->getImageBlob());

            return array("filename" => $imageFileName,
                         "url_thumb" => "https://shoterate.blob.core.windows.net/" .
                            $containerName . "/thumb_" . $imageFileName);
        }
        catch(ServiceException $e)
        {
            $code = $e->getCode();
            $error_message = $e->getMessage();
            return false;
        }
    }



    // Delete image
    public static function deleteImage($userId, $imageName)
    {
        $containerName = "user" . $userId;

        try
        {
            // send file to azure blob storage
            $blobRestProxy = ServicesBuilder::getInstance()->createBlobService(Azure::getConnectionString());
            $blobRestProxy->deleteBlob($containerName, $imageName);
            $blobRestProxy->deleteBlob($containerName, "thumb_" . $imageName);

            return true;
        }
        catch(ServiceException $e)
        {
            $code = $e->getCode();
            $error_message = $e->getMessage();
            return false;
        }
    }
}
