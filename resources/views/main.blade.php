@extends('app')

@section('content')

<!-- Navbar -->
<div id="divNavBar">
    <div id="divNavBarContainer">
        <div id="divNavBarHeading">
            <a href="{{ url('/search') }}"><img src="{{ asset('res/images/title.png') }}" height="25" /></a>
        </div>

        <div id="divNavBarLinks">
            <a href="{{ url('/search') }}">Search</a>

            @if (Auth::guest())
                <a href="{{ url('/') }}">Home</a>
            @else
                <a href="{{ url('/account/storyboards') }}">Account</a>
                <a href="{{ url('/logout') }}">Logout</a>
            @endif

            <a href="{{ url('/help') }}">Help</a>
        </div>

        <div class="clearfix"></div>
    </div>
</div>


<!-- Main Content -->
<div id="divContentMain">
    @yield('contentMain')
</div>


<!-- Button to go to top of page -->
<div id="divGoToTop" title="Go to top of page" style="display: none">
</div>

@endsection
