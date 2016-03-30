<?php

namespace App\Http\Controllers;

use DB;
use Log;
use Auth;
use App\Http\Requests;
use Illuminate\Http\Request;

class TestController extends Controller
{
    private $dotenv;

    public function __construct()
    {
        $this->middleware('auth');
    }

    public function test(Request $request)
    {

    }
}
