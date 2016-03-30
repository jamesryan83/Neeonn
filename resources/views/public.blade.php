@extends('main')

@section('contentMain')

<!-- Public base -->
<div id="divPublic">
    <h1 class="h1PageHeading">Public</h1>
    <hr>

    <!-- Navigation tabs along top -->
    <div id="divPublicTabs">

        <div id="divTabLatest"
                class="divTabMain {{Request::is( 'public/latest' ) ? 'tabSelected' : '' }}">
            <a href="{{ url('/public/latest') }}">Latest</a>
            <hr>
        </div>
        
        <div id="divTabTrending"
                class="divTabMain {{Request::is( 'public/trending' ) ? 'tabSelected' : '' }}">
            <a href="{{ url('/public/trending') }}">Trending</a>
            <hr>
        </div>

    </div>


    <!-- Content -->
    <div id="divPublicContent">
        @yield('contentPublic')
    </div>
</div>

@endsection
