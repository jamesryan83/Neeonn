
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



<!-- From Url dialog -->
<script type="text/template" id="templateDialogFromUrl">
<div id="divDialogFromUrl">
    <h2>Picture from url</h2>

    <p>Paste a Url in the textbox below and click OK</p>
    <label>Url</label>
    <input id="inputFromUrl" />

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
            <td><div id="selectCategoryContainer"><select id="selectCategory"/></div></td>
        </tr>
        <tr>
            <td><label>First Scene</label></td>
            <td>
                <select id="selectFirstScene">
                    <option value="canvastext">Canvas Left, Text Right</option>
                    <option value="textcanvas">Text Left, Canvas Right</option>
                    <option value="text">Text Only</option>
                    <option value="canvas">Canvas Only</option>
                </select>
            </td>
        </tr>
    </table>

    <div id="divCheckboxes">
        <div>
            <input type="checkbox" id="checkboxPrivate" class="css-checkbox" checked/>
            <label for="checkboxPrivate" class="css-label">Private</label>

            <input type="checkbox" id="checkboxAllowComments" class="css-checkbox" checked/>
            <label for="checkboxAllowComments" class="css-label">Allow Comments</label>
        </div>
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

    <div id="divGalleryImagesContainer">

    </div>

    <div id="divButtons">
        <button id="buttonFromUrl" class="buttonCustom1">Add From Url</button>
        <div id="buttonFromComputer" class="upload">
            <label>Add From Computer</label>
            <input class="fileupload" type="file" name="files[]" data-url="/upload-image">
        </div>
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
        <div id="divCloseButton"></div>
        <hr>
    </div>

    <div id="divContent">

    </div>
</div>
</script>



<!-- Canvas Choose Picture dialog -->
<script type="text/template" id="templateDialogCanvasChoosePicture">
<div id="divDialogCanvasChoosePicture">
    <h2>Pictures & Background</h2>

    <div id="divButtons">
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



<!-- Scene pattern dialog -->
<script type="text/template" id="templateDialogScenePattern">
<div id="divDialogScenePattern">
    <div id="divTitle">
        <h2>Select a Pattern</h2>
    </div>

    <div id="divPatterns">
    </div>

    <div id="divButtons">
        <button id="buttonDialogRemovePattern" class="buttonCustom1">Remove Pattern</button>
        <button id="buttonDialogCancel" class="buttonCustom1">Cancel</button>
    </div>
</div>
</script>


<!-- Position background image dialog -->
<script type="text/template" id="templateDialogPositionBackgroundImage">
<div id="divDialogPositionBackgroundImage">
    <div id="divTitle">
        <h2>Postion Image</h2>
    </div>

    <div id="divPictureContainer">
        <img id="imgPicture" />
        <div id="divPicture" class="center"></div>
    </div>

    <div id="divBottom">
        <table id="tableRangeContainer">
            <tr>
                <td><label>Scale</label></td>
                <td id="tdRange">
                    <input id="inputRange" type="range" min="10" max="250" step="1" value="100" />
                </td>
            </tr>
        </table>

        <div id="divButtons">
            <button id="buttonDialogOk" class="buttonCustom1">Ok</button>
            <button id="buttonDialogCancel" class="buttonCustom1">Cancel</button>
        </div>

        <div class="clearfix"></div>
    </div>


</div>
</script>


<!-- Emoji dialog -->
<script type="text/template" id="templateDialogEmoji">
    <div id="divDialogEmoji" class="center">
        <div id="divTitle">
            <h2>Emojis</h2>
        </div>

        <div id="divImagesBackground">
        </div>

        <div id="divImages">

        </div>

        <div id="divButtons">
            <button id="buttonDialogCancel" class="buttonCustom1">Cancel</button>
        </div>
    </div>
</script>


<!-- Image Storyboard link dialog -->
<script type="text/template" id="templateDialogImageStoryboardLink">
    <div id="divDialogImageStoryboardLink" class="center">
        <div id="divTitle">
            <h2>This Image is being used</h2>
        </div>

        <p>This image is used in the following storyboards</p>

        <div id="divStoryboards">
            <ul id="ulStoryboards"></ul>
        </div>

        <div id="divButtons">
            <button id="buttonDialogDelete" class="buttonCustom1">Delete Anyway</button>
            <button id="buttonDialogCancel" class="buttonCustom1">Cancel</button>
        </div>
    </div>
</script>
