@extends('main')

@section('contentMain')

<!-- Search Page -->
<div id="divComments" data-storyboard_id="{{ $storyboard_id }}">


    <!-- Loading -->
    <div id="divLoading">
        <img class="center" src="{{ asset('res/loading_hourglass2.svg') }}" height=40 width=40  />
    </div>


    <!-- Comments -->
    <div id="divContent">
        <div id="divStoryboard">

        </div>

        <div id="divCommentsArea">
            <label id="labelNumComments"></label>
            <hr>

            @if (!Auth::guest())
                <div id="divCommentInputsMain"></div>
            @endif

            <div id="divCommentsList">

            </div>
        </div>
    </div>

</div>

@endsection
