<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $table = "comments";
    public $timestamps = true;
    protected $dateFormat = 'Y-m-d H:i:s.0000000';
    protected $primaryKey = "comment_id";

    protected $fillable = [
        "storyboard_id",
        "user_id",
        "text",
        "parent_id",
        "points",
        "is_deleted"
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
