
<!-- Backbone Scripts -->
<!-- Scripts are loaded depending on the url path -->

@if(Request::path() === "/")

@elseif(Request::url() === "public/latest")

@elseif(Request::path() === "public/trending")

@elseif(Request::path() === "public/trending")

@elseif(Request::path() === "help")

@elseif(Request::is("edit-storyboard/*"))
    <script src="{{ asset('js/view_editStoryboard.js') }}"></script>
    <script src="{{ asset('lib/fabric.js') }}"></script>
    <script src="{{ asset('lib/ckeditor/ckeditor.js') }}"></script>
    <link rel="stylesheet" href="{{ asset('lib/spectrum/spectrum.css') }}" />
    <script src="{{ asset('lib/spectrum/spectrum.js') }}"></script>

@elseif(Request::path() === "account/storyboards")
    <script src="{{ asset('js/view_accountStoryboards.js') }}"></script>

@elseif(Request::path() === "account/gallery")
    <script src="{{ asset('js/view_accountGallery.js') }}"></script>

@elseif(Request::path() === "account/social")

@elseif(Request::path() === "account/settings")
    <script src="{{ asset('js/view_accountSettings.js') }}"></script>

@elseif(Request::path() === "account/change-password")
    <script src="{{ asset('js/view_changePassword.js') }}"></script>

@elseif(Request::is("edit-image/*"))
    <script src="{{ asset('js/view_editImage.js') }}"></script>
@endif


