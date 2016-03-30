@extends('account')

@section('contentAccount')

<!-- Storyboards -->
<div id="divContentStoryboards">

    <div id="divControls">
        <button id="buttonCreateStoryboard" class="buttonCustom1">Create New Storyboard</button>

        <label>Search</label>
        <input id="inputSearch" />
    </div>


    <div id="divStoryboardsContainer">
        <div id="divLoadingStoryboards">
            <img class="center" src="{{ asset('res/loading_hourglass2.svg') }}" height=40 width=40  />
        </div>

        <div id="divStoryboards">

        </div>

        <div id="divNoStoryboards">
            <p>You have no Storyboards !</p>
            <p>Click <b><i>Create New Storyboard</i></b> to add one</p>
        </div>
    </div>

</div>

@endsection
