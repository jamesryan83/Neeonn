
<!-- Head Scripts -->
<!-- Scripts are loaded depending on the url path -->

@if(Request::path() === "/")

@elseif(Request::path() === "search")

@elseif(Request::path() === "account/storyboards")

@elseif(Request::path() === "account/gallery")

@elseif(Request::path() === "account/social")

@elseif(Request::path() === "account/settings")

@elseif(Request::path() === "account/change-password")

@elseif(Request::is("edit-storyboard/*"))
    <link rel="stylesheet" href="{{ asset('lib/spectrum/spectrum.css') }}" />
    <script src="{{ asset('lib/fabric.js') }}"></script>
    <script src="{{ asset('lib/ckeditor/ckeditor.js') }}"></script>
    <script src="{{ asset('lib/spectrum/spectrum.js') }}"></script>

@elseif(Request::path() === "help")
    <script src="{{ asset('lib/fabric.js') }}"></script>

@endif
