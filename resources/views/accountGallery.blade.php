@extends('account')

@section('contentAccount')

<!-- Gallery -->
<div id="divContentGallery">

    <div id="divButtons">
        <button id="buttonFromUrl" class="buttonCustom1">Add From Url</button>
        <div id="buttonFromComputer" class="upload">
            <label>Add From Computer</label>
            <input class="fileupload" type="file" name="files[]" data-url="/upload-image">
        </div>
    </div>

    <div id="divGalleryImagesContainer">
        <div id="divPictures">

        </div>

        <div id="divNoImages" style="display: none">
            <p>You have no images !</p>
            <p>Click <b><i>Add From Url</i></b> or <b><i>Add From Computer</i></b> to add some</p>
        </div>
    </div>
</div>

@endsection
