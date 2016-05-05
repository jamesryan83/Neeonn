<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Storyboard extends Model
{
    protected $table = "storyboards";
    public $timestamps = true;
    protected $dateFormat = 'Y-m-d H:i:s.0000000';
    protected $primaryKey = "storyboard_id";


    protected $fillable = [
        "user_id",
        "title",
        "summary",
        "category",
        "likes",
        "views",
        "is_private",
        "allow_comments",
        "num_comments",
        "scene_color",
        "scene_pattern"
    ];

    public function user()
    {
        return $this->belongsTo("App\Models\User");
    }

    public function scenes()
    {
        return $this->hasMany("App\Models\Scene");
    }

    public function comments()
    {
        return $this->hasMany("App\Models\Comment");
    }
}
