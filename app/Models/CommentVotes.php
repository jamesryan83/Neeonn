<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommentVotes extends Model
{
    protected $table = "commentVotes";
    public $timestamps = true;
    protected $dateFormat = 'Y-m-d H:i:s.0000000';
    protected $primaryKey = "comment_votes_id";

    protected $fillable = [
        "comment_id",
        "user_id",
        "storyboard_id",
        "direction"
    ];

    public function user()
    {
        return $this->belongsTo("App\Models\User");
    }
}
