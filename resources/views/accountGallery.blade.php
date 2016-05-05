@extends('account')

@section('contentAccount')

<!-- Gallery -->
<div id="divContentGallery">

    <div id="divButtons">
        <button id="buttonFromUrl" class="buttonCustom1"
                title="Upload image from an Url">Add From Link</button>
        <div id="buttonFromComputer" class="upload" title="Upload image from your computer">
            <label>Add From Computer</label>
            <input class="fileupload" type="file" name="files[]" data-url="/upload-image">
        </div>
    </div>

    <div id="divGalleryImagesContainer">

    </div>
</div>

@endsection
