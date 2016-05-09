@extends('main')

@section('contentMain')

<!-- Account base -->
<div id="divAccount">

    <!-- Navigation tabs along top -->
    <div id="divAccountTabs">

        <div id="divTabStoryboards"
                class="divTabMain {{Request::is( 'account/storyboards' ) ? 'tabSelected' : '' }}">
            <a href="{{ url('/account/storyboards') }}">Storyboards</a>
            <hr>
        </div>

        <div id="divTabGallery"
                class="divTabMain {{Request::is( 'account/gallery' ) ? 'tabSelected' : '' }}">
            <a href="{{ url('/account/gallery') }}">Gallery</a>
            <hr>
        </div>

        <!-- <div id="divTabSocial"
                class="divTabMain {{Request::is( 'account/social' ) ? 'tabSelected' : '' }}">
            <a href="{{ url('/account/social') }}">Social</a>
            <hr>
        </div> -->

        <div id="divTabSettings"
                class="divTabMain {{Request::is( 'account/settings' ) ? 'tabSelected' : '' }}">
            <a href="{{ url('/account/settings') }}">Settings</a>
            <hr>
        </div>

    </div>


    <!-- Content -->
    <div id="divAccountContent">
        @yield('contentAccount')
    </div>
</div>

@endsection
