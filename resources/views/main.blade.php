@extends('app')

@section('content')

<!-- Navbar -->
<div id="divNavBar">
    <div id="divNavBarContainer">
        <div id="divNavBarHeading">
            <a href="{{ url('/public/latest') }}"><img src="{{ asset('res/images/title.png') }}" height="25" /></a>
        </div>

        <div id="divNavBarLinks">
            <a href="{{ url('/public/latest') }}">Public</a>
            <a href="{{ url('/search') }}">Search</a>

            @if (Auth::guest())
                <a href="{{ url('/') }}">Home</a>
            @else
                <a href="{{ url('/account/storyboards') }}">Account</a>
                <a href="{{ url('/logout') }}">Logout</a>
            @endif

            <a href="{{ url('/help') }}">Help</a>
        </div>

        <div id="divNavBarLinksMenu">
            <div id="divMenuButton"></div>
        </div>

        <div class="clearfix"></div>
    </div>
</div>


<!-- Main Content -->
<div id="divContentMain">
    @yield('contentMain')
</div>

@endsection
