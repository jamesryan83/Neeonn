<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Shoterate</title>

        <link rel="stylesheet" href="{{ asset('lib/normalize.css') }}" />
        <link rel="stylesheet" href="{{ asset('lib/jquery-toast/jquery.toast.min.css') }}" />
        <link rel="stylesheet" href="{{ asset('lib/cropper/cropper.min.css') }}" />

        <link href="{{ elixir('css/app.css') }}" rel="stylesheet">

        <link rel="shortcut icon" href="{{ asset('favicon.ico') }}">

        <script src="{{ asset('lib/jquery-2.1.4.js') }}"></script>
        <script src="{{ asset('lib/underscore.js') }}"></script>
        <script src="{{ asset('lib/backbone.js') }}"></script>
        <script src="{{ asset('lib/jquery-file-upload/jquery.ui.widget.js') }}"></script>
        <script src="{{ asset('lib/jquery-file-upload/canvas-to-blob.js') }}"></script>
        <script src="{{ asset('lib/jquery-file-upload/jquery.iframe-transport.js') }}"></script>
        <script src="{{ asset('lib/jquery-file-upload/jquery.fileupload.js') }}"></script>
        <script src="{{ asset('lib/jquery-file-upload/jquery.fileupload-process.js') }}"></script>
        <script src="{{ asset('lib/jquery-file-upload/jquery.fileupload-validate.js') }}"></script>
        <script src="{{ asset('lib/caman.full.min.js') }}"></script>
        <script src="{{ asset('lib/cropper/cropper.min.js') }}"></script>
        <script src="{{ asset('lib/jquery-toast/jquery.toast.min.js') }}"></script>

        <script src="{{ asset('js/data.js') }}"></script>
        <script src="{{ asset('js/util.js') }}"></script>
        <script src="{{ asset('js/server.js') }}"></script>
        <script src="{{ asset('js/test.js') }}"></script>

        @include('scriptsHead')
    </head>


    <body>
        <!-- Main Content -->
        <div id="divContentApp">
            @yield('content')
        </div>

        <div id="divDialogContainer"></div>

        <!-- Backbone Template files -->
        @include('templatesDialog')
        @include('templatesOther')

        <!-- Backbone Scripts -->
        @include('scripts')

        <script src="{{ asset('js/view_dialog.js') }}"></script>
    </body>
</html>
