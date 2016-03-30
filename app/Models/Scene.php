<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Scene extends Model
{
    protected $table = "scenes";
    public $timestamps = true;
    protected $dateFormat = 'Y-m-d H:i:s.0000000';
    protected $primaryKey = "scene_id";

    protected $fillable = [
        "user_id",
        "storyboard_id",
        "storyboard_index",
        "image_url",
        "text",
        "canvas_data_json",
        "canvas_data_svg",
        "type"
    ];

    public function user()
    {
        return $this->belongsTo("App\Models\User");
    }

    public function storyboard()
    {
        return $this->belongsTo("App\Models\Storyboard");
    }
}
