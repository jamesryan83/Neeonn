<!-- Storyboard Templates -->

<!-- Scene Item -->
<script type="text/template" id="templateStoryboardSceneItemBasic">
<div class="divStoryboardSceneItemBasic" data-type="<%- sceneType %>">
    <div class="divControls">
        <label class="labelSceneIndex"></label>
        <div class="divDeleteSceneButton" title="Delete this Scene"></div>
        <div class="divMoveDownButton" title="Swap with Scene below"></div>
        <div class="divMoveUpButton" title="Swap with Scene above"></div>
        <div class="divAddImageButton" title="Add Image"></div>
        <!-- <div class="divSettingsButton" title="Settings"></div> -->
    </div>

    <div class="divInner">
        <div>
            <div class="divPicture">
                <div class="divPictureContainer">
                    <img />
                </div>
            </div>

            <div class="divCanvas">
                <div class="divCanvasContainer" tabindex="1">
                    <canvas id="canvas<%- sceneIndex %>" class="canvasMain"  tabindex="1"></canvas>
                </div>
            </div>

            <div class="divText">
                <div class="divTextContainer">
                    <div id="editor<%- sceneIndex %>"
                        class="divActualText" contenteditable="false" spellcheck="false"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="divEditorControls">
        <div id="divCanvasControls<%- sceneIndex %>" class="divCanvasControls">
            <input type="text" id="inputColorPicker<%- sceneIndex %>" class="inputColorPicker" />
            <div class="divCanvasButtonSelect" title="Select"></div>
            <div class="divCanvasButtonSketch" title="Sketch"></div>
            <select class="selectPathThickness" title="Sketch pen thickness">
                <option value="1">1</option>
                <option value="3">3</option>
                <option value="5" selected="true">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
            </select>
            <div class="divCanvasButtonText" title="Text"></div>
            <div class="divCanvasButtonPicture" title="Picture"></div>
            <div class="divCanvasButtonCircle" title="Circle"></div>
            <div class="divCanvasButtonTriangle" title="Triangle"></div>
            <div class="divCanvasButtonRectangle" title="Rectangle"></div>
            <div class="divCanvasButtonStar" title="Star"></div>
            <div class="divCanvasButtonMoveBottom" title="Move to Bottom"></div>
            <div class="divCanvasButtonMoveDown" title="Move Down"></div>
            <div class="divCanvasButtonMoveUp" title="Move Up"></div>
            <div class="divCanvasButtonMoveTop" title="Move to Top"></div>
            <div class="divCanvasButtonClear" title="Clear Canvas"></div>
        </div>

        <div id="divEditorTop<%- sceneIndex %>" class="editorTop"></div>
        <div id="divEditorBottom<%- sceneIndex %>" class="editorBottom"></div>
    </div>
</div>
</script>


<!-- Storyboard Item (inc. scene) -->
<script type="text/template" id="templateStoryboardSceneItemFull">
<div class="divStoryboardSceneItemFull" data-storyboardid="<%- storyboardId %>">

    <div class="divControls">
        <div class="divButtonDelete" title="Delete this Storyboard"></div>
        <div class="divButtonEdit" title="Edit this Storyboard"></div>
        <div class="divButtonExpand" title="View in Full Screen"></div>
        <div class="divButtonShare" title="Share"></div>
        <div class="divButtonStar" title="Star"></div>
        <div class="divStarNumber imgText">0</div>
        <div class="divButtonComment" title="Comment"></div>
        <div class="divCommentNumber imgText">0</div>
        <div class="clearfix"></div>
    </div>

    <div class="divInner">
        <div class="divTitle">
            <h3 class="h3Title"><%- storyboardTitle %></h3>
        </div>

        <div class="divContentArea">
        </div>
    </div>

    <div class="divImageMenu">
        <div class="divImageMenuItems">
        </div>

        <div class="divNavigation">
            <div class="divNavPrevious noselect" title="Previous Scene" />
            <div class="divNavNext noselect" title="Next Scene" />
        </div>
    </div>

</div>
</script>
