<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    public $timestamps = true;
    protected $dateFormat = 'Y-m-d H:i:s.0000000';
    protected $primaryKey = "user_id";


    protected $fillable = [
        "fullname",
        "username",
        "email",
        "password",
        "website",
        "location",
        "summary",
        "is_active",
        "views",
        "last_login",
        "api_token"
    ];


    protected $hidden = [
        "password",
        "remember_token",
    ];


    public function getId()
    {
        return $this->user_id;
    }


    public function storyboards()
    {
        return $this->hasMany("App\Models\Storyboard");
    }

}
