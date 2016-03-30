
<!-- Dialog Templates -->


<!-- Ok Cancel dialog -->
<script type="text/template" id="templateDialogOkCancel">
<div id="divDialogOkCancel">
    <h2><%- heading %></h2>

    <p><%- text1 %></p>
    <p><%- text2 %></p>

    <div id="divButtons">
        <button id="buttonDialogOk" class="buttonCustom1">Ok</button>
        <button id="buttonDialogCancel" class="buttonCustom1">Cancel</button>
    </div>
</div>
</script>


<!-- Choose Picture dialog -->
<script type="text/template" id="templateDialogChoosePicture">
<div id="divDialogChoosePicture">
    <h2>Choose Picture</h2>

    <div id="divButtons">
        <button id="buttonDialogFromGallery" class="buttonCustom1">From Gallery</button>
        <button id="buttonDialogRemovePicture" class="buttonCustom1">Remove Picture</button>
        <button id="buttonDialogCancel" class="buttonCustom1">Cancel</button>
    </div>

    <div id="divProgress" style="display: none">
        <img src="../res/loading_hourglass.svg" height=50 width=50 />
    </div>
</div>
</script>



<!-- From Url dialog -->
<script type="text/template" id="templateDialogFromUrl">
<div id="divDialogFromUrl">
    <h2>Picture from url</h2>

    <p>Paste a Url in the textbox below and click OK</p>
    <label>Url</label>
    <input id="inputFromUrl" value="https://i.imgur.com/Lw7EHEm.jpg" />

    <div id="divButtons">
        <button id="buttonDialogOk" class="buttonCustom1">Ok</button>
        <button id="buttonDialogCancel" class="buttonCustom1">Cancel</button>
    </div>
</div>
</script>



<!-- Create Storyboard dialog -->
<script type="text/template" id="templateDialogCreateStoryboard">
<div id="divDialogCreateStoryboard">
    <h2>Create Storyboard</h2>

    <table>
        <tr>
            <td><label>Title</label></td>
            <td><input type="text" id="inputTitle" /></td>
        </tr>
        <tr>
            <td><label>Category</label></td>
            <td><select id="selectCategory" /></td>
        </tr>
        <tr>
            <td><label>First Scene</label></td>
            <td>
                <select id="selectFirstScene">
                    <option value="imagetext">Image Left, Text Right</option>
                    <option value="textimage">Text Left, Image Right</option>
                    <option value="text">Text Only</option>
                    <option value="image">Image Only</option>
                    <option value="canvastext">Canvas Left, Text Right</option>
                    <option value="textcanvas">Text Left, Canvas Right</option>
                    <option value="canvas">Canvas Only</option>
                </select>
            </td>
        </tr>
    </table>

    <div id="divCheckboxes">
        <input type="checkbox" id="checkboxShowTitle" class="css-checkbox" checked="checked"/>
        <label for="checkboxShowTitle" class="css-label">Show Title</label>

        <input type="checkbox" id="checkboxPrivate" class="css-checkbox"/>
        <label for="checkboxPrivate" class="css-label">Private</label>

        <input type="checkbox" id="checkboxAllowComments" class="css-checkbox" checked="checked"/>
        <label for="checkboxAllowComments" class="css-label">Allow Comments</label>
    </div>

    <div id="divButtons">
        <button id="buttonDialogOk" class="buttonCustom1">Ok</button>
        <button id="buttonDialogCancel" class="buttonCustom1">Cancel</button>
    </div>
</div>
</script>



<!-- Picture Gallery dialog -->
<script type="text/template" id="templateDialogPictureGallery">
<div id="divDialogPictureGallery">
    <div id="divTitle">
        <h2>Gallery</h2>
    </div>

    <div id="divPictures">

    </div>

    <div id="divProgress">
        <img src="../res/loading_hourglass2.svg" height=50 width=50 class="center" />
    </div>

    <div id="divNoImages">
        <div id="divNoImagesInner" class="center">
            <p>You have no images !</p>
            <p>Go to the Gallery in your Account to add some</p>
            <button id="buttonDialogGoToGallery" class="buttonCustom1">Take me to my Gallery</button>
        </div>
    </div>

    <div id="divButtons">
        <button id="buttonDialogCancel" class="buttonCustom1">Cancel</button>
    </div>
</div>
</script>



<!-- View Picture dialog -->
<script type="text/template" id="templateDialogViewPicture">
<div id="divDialogViewPicture" class="center">
    <img id="imgViewPicture" class="center" />
</div>
</script>



<!-- Storyboard Full Screen dialog -->
<script type="text/template" id="templateDialogStoryboardFullScreen">
<div id="divDialogStoryboardFullScreen" class="center">

    <div id="divTitle">
        <h2 id="divTitle"><%- title %></h2>
        <hr>
    </div>

    <div id="divContent">

    </div>

    <div id="divButtons">
        <hr>
        <button id="buttonDialogClose" class="buttonCustom1 center">Close</button>
    </div>
</div>
</script>



<!-- Canvas Choose Picture dialog -->
<script type="text/template" id="templateDialogCanvasChoosePicture">
<div id="divDialogCanvasChoosePicture">
    <h2>Pictures & Background</h2>

    <div id="divButtons">
        <button id="buttonDialogAddPicture" class="buttonCustom1">Add Picture</button>
        <button id="buttonDialogAddBackgroundPicture" class="buttonCustom1">Add Background Picture</button>
        <button id="buttonDialogAddBackgroundColor" class="buttonCustom1">Add Background Color</button>
        <button id="buttonDialogRemoveBackground" class="buttonCustom1">Remove Background</button>
        <button id="buttonDialogCancel" class="buttonCustom1">Cancel</button>
    </div>

    <div id="divProgress" style="display: none">
        <img src="../res/loading_hourglass.svg" height=50 width=50 />
    </div>
</div>
</script>
