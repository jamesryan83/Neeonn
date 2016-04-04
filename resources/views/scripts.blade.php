
<!-- Backbone Scripts -->
<!-- Scripts are loaded depending on the url path -->

@if(Request::path() === "/")

@elseif(Request::path() === "search")
    <script src="{{ asset('js/view_search.js') }}"></script>
    <script src="{{ asset('js/storyboardItem.js') }}"></script>
    <script src="{{ asset('js/sceneItem.js') }}"></script>

@elseif(Request::path() === "account/storyboards")
    <script src="{{ asset('js/view_accountStoryboards.js') }}"></script>
    <script src="{{ asset('js/storyboardItem.js') }}"></script>
    <script src="{{ asset('js/sceneItem.js') }}"></script>

@elseif(Request::path() === "account/gallery")
    <script src="{{ asset('js/view_accountGallery.js') }}"></script>

@elseif(Request::path() === "account/social")

@elseif(Request::path() === "account/settings")
    <script src="{{ asset('js/view_accountSettings.js') }}"></script>

@elseif(Request::path() === "account/change-password")
    <script src="{{ asset('js/view_changePassword.js') }}"></script>

@elseif(Request::is("edit-storyboard/*"))
    <script src="{{ asset('js/view_editStoryboard.js') }}"></script>
    <script src="{{ asset('js/sceneItem.js') }}"></script>

@elseif(Request::is("edit-image/*"))
    <script src="{{ asset('js/view_editImage.js') }}"></script>

@elseif(Request::path() === "help")

@endif
