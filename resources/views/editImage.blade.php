@extends('main')

@section('contentMain')

<!-- Add Images -->
<div id="divEditImage">
    <h1 class="h1PageHeading">Edit Image</h1>
    <hr>

    <!-- Image -->
    <div id="divImageContainer">
        <div class="divImageBox">
            <p>Actual</p>
            <div id="divImage">
                <img id="imgMain" src="{{ asset($url) }}" class="center" />
            </div>
        </div>

        <div class="divImageBox">
            <p>Preview</p>
            <div id="divImagePreviewContainer">
                <div id="divImagePreview" class="center">
                    <canvas id="imgMainPreview" class="center" width="400" height="400" />
                </div>
            </div>
        </div>
    </div>



    <!-- Crop and Filter buttons -->
    <div id="divButtonsAndFilters">

        <div id="divActions">

            <div id="divAspectRatios">
                <p>Aspect Ratios</p>
                <button id="buttonAspectFree" class="buttonCustom1" title="Custom Size">Free</button>
                <button id="buttonAspectHalfWidth" class="buttonCustom1"
                        title="Half scene width">Half Width</button>
                <button id="buttonAspectFullWidth" class="buttonCustom1"
                        title="Full scene width">Full Width</button>
            </div>

            <div id="divFilters">
                <p id="pFilters">Filters</p>
                <button class="buttonCustom1" data-preset="none">None</button>
                <button class="buttonCustom1" data-preset="vintage">Vintage</button>
                <button class="buttonCustom1" data-preset="lomo">Lomo</button>
                <button class="buttonCustom1" data-preset="clarity">Clarity</button>
                <button class="buttonCustom1" data-preset="sinCity">Sin City</button>
                <button class="buttonCustom1" data-preset="sunrise">Sunrise</button>
                <button class="buttonCustom1" data-preset="crossProcess">Cross Process</button>
                <button class="buttonCustom1" data-preset="orangePeel">Orange Peel</button>
                <button class="buttonCustom1" data-preset="love">Love</button>
                <button class="buttonCustom1" data-preset="grungy">Grungy</button>
                <button class="buttonCustom1" data-preset="jarques">Jarques</button>
                <button class="buttonCustom1" data-preset="pinhole">Pinhole</button>
                <button class="buttonCustom1" data-preset="oldBoot">Old Boot</button>
                <button class="buttonCustom1" data-preset="glowingSun">Glowing Sun</button>
                <button class="buttonCustom1" data-preset="hazyDays">Hazy Days</button>
                <button class="buttonCustom1" data-preset="herMajesty">Her Majesty</button>
                <button class="buttonCustom1" data-preset="nostalgia">Nostalgia</button>
                <button class="buttonCustom1" data-preset="hemingway">Hemingway</button>
                <button class="buttonCustom1" data-preset="concentrate">Concentrate</button>
            </div>
        </div>

        <div id="divButtonsAndLoading">
            <div id="divButtons">
                <button id="buttonSave" class="buttonCustom2">Save & Return</button>
                <button id="buttonCancel" class="buttonCustom3">Cancel</button>
            </div>

            <div id="divLoadingContainer">
                <div id="divLoading">
                    <img class="center" src="{{ asset('res/loading_hourglass2.svg') }}" height=40 width=40  />
                </div>
            </div>
        </div>

    </div>
</div>

@endsection
