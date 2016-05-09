<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Neeonn</title>
        <link rel="shortcut icon" href="{{ asset('favicon.ico') }}">

        <!-- DEBUGmode -->
        @include('scriptsHeadPro')
        {{-- @include('scriptsHeadDev') --}}

        <link rel="stylesheet" href="{{ asset('lib/jquery-toast/jquery.toast.min.css') }}" />
        <script src="{{ asset('lib/ckeditor/ckeditor.js') }}"></script>

        <link href="{{ elixir('css/app.css') }}" rel="stylesheet">
    </head>


    <body>
        <!-- Main Content -->
        <div id="divContentApp">
            @yield('content')
        </div>

        <div id="divDialogContainer"></div>
        <div id="divGalleryContainer"></div>

        <!-- Backbone Template files -->
        @include('templatesDialog')
        @include('templatesOther')

        <!-- Backbone Scripts -->
        <!-- DEBUGmode -->
        @include('scriptsBodyPro')
        {{-- @include('scriptsBodyDev') --}}

    </body>
</html>
