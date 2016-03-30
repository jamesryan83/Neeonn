@extends('main')

@section('contentMain')

<!-- Edit Storyboard -->
<div id="divEditStoryboard" data-storyboardId="{{ $storyboardId }}">

    <h1 class="h1PageHeading">Edit Storyboard</h1>
    <hr>

    <div id="divEditStoryboardContent">


        <!-- Controls -->
        <div id="divEditStoryboardControls">
            <div id="divInputs">
                <label>Title</label>
                <input id="inputEditStoryboardTitle" />

                <label>Category</label>
                <select id="selectEditStoryboardCategory"></select>
            </div>

            <div id="divControls">

                <div>
                    <input type="checkbox" id="checkboxShowTitle"
                        class="css-checkbox" checked="checked"/>
                    <label for="checkboxShowTitle" class="css-label">Show Title</label>
                </div>

                <div>
                    <input type="checkbox" id="checkboxPrivate"
                        class="css-checkbox" checked="checked"/>
                    <label for="checkboxPrivate" class="css-label">Private</label>
                </div>

                <div>
                    <input type="checkbox" id="checkboxAllowComments"
                        class="css-checkbox" checked="checked"/>
                    <label for="checkboxAllowComments" class="css-label">Allow Comments</label>
                </div>

                <button id="buttonSave" class="buttonCustom2">Save</button>
                <button id="buttonBackToStoryboards" class="buttonCustom1">Back to Storyboards</button>
            </div>
        </div>

        <hr>

        <!-- Add Scene Buttons -->
        <div id="divAddScene">
            <label>Add a Scene</label>
            <button id="buttonAddSceneImageText" class="buttonCustom1" title="Image Left, Text Right"></button>
            <button id="buttonAddSceneTextImage" class="buttonCustom1" title="Text Left, Image Right"></button>
            <button id="buttonAddSceneText" class="buttonCustom1" title="Text Only"></button>
            <button id="buttonAddSceneImage" class="buttonCustom1" title="Image Only"></button>
            <button id="buttonAddSceneCanvasText" class="buttonCustom1" title="Canvas Left, Text Right"></button>
            <button id="buttonAddSceneTextCanvas" class="buttonCustom1" title="Text Left, Canvas Right"></button>
            <button id="buttonAddSceneCanvas" class="buttonCustom1" title="Canvas Only"></button>
        </div>

        <!-- Scenes -->
        <div id="divScenes">

        </div>
        
    </div>

</div>


@endsection
