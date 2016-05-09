<!-- Storyboard Templates -->

<!-- Scene Item -->
<script type="text/template" id="templateStoryboardSceneItemBasic">
<div class="divStoryboardSceneItemBasic" data-type="<%- type %>" data-scene_id="<%- scene_id %>">
    <div class="divControls">
        <label class="labelSceneIndex"></label>
        <div class="divDeleteSceneButton" title="Delete this Scene"></div>
        <div class="divMoveDownButton" title="Swap with Scene below"></div>
        <div class="divMoveUpButton" title="Swap with Scene above"></div>
    </div>

    <div class="divInner">
        <div>
            <div class="divCanvas">
                <div class="divCanvasContainer" tabindex="1">
                    <canvas class="canvasMain" tabindex="1"></canvas>
                </div>
            </div>

            <div class="divText">
                <div class="divTextContainer">
                    <div class="divActualText" contenteditable="false" spellcheck="false"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="divEditorControls">
        <div class="divCanvasControls">
            <input type="text" class="inputCanvasColorPicker" />
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
            <div class="divCanvasButtonPicture" title="Image or Background Color"></div>
            <div class="divCanvasButtonEmoji" title="Emojis"></div>
            <div class="divCanvasButtonClear" title="Clear Canvas"></div>
        </div>


        <div class="divTextControls">
            <input type="text" class="inputTextColorPicker" />
            <div class="editorTop"></div>
            <div class="editorBottom"></div>
            <div class="clearfix"></div>
        </div>

        <div class="clearfix"></div>
    </div>
</div>
</script>


<!-- Storyboard Item (including scene) -->
<script type="text/template" id="templateStoryboardSceneItemFull">
<div class="divStoryboardSceneItemFull" data-storyboard_id="<%- storyboard_id %>">

    <div class="divAboveStoryboard">
        <div class="divCategory">
            <label class="labelCategory" title="Category"><%- category %></label>
        </div>
        <label class="labelTitle" title="Title"><%- title %></label>
        <label class="labelUsername" title="Username"><%- username %></label>
        <div class="clearfix"></div>
    </div>

    <div class="divInner">
        <div class="divContentArea">
            <div class="divPicture">
            </div>

            <div class="divText">
                <div class="divActualText"></div>
            </div>

            <div class="clearfix"></div>
        </div>
    </div>


    <div class="divBelowStoryboard">
        <div class="divNavigation">
            <label class="labelCurrentScene" title="Current Scene/Total Scenes"></label>
            <div class="divNavPrevious noselect" title="Previous Scene" />
            <div class="divNavNext noselect" title="Next Scene" />
        </div>

        <div class="divControls">
            <div class="divIconPrivate" title="This Storyboard is Private"></div>
            <label class="divCommentNumber imgText" title="Number of Comments"><%- num_comments %></label>
            <div class="divButtonComment" title="Comment"></div>
            <label class="divStarNumber imgText" title="Number of Stars"  style="display: none;">0</label>
            <div class="divButtonStar" title="Star"  style="display: none;"></div>
            <div class="divButtonShare" title="Share"  style="display: none;"></div>
            <div class="divButtonExpand" title="View Full Screen"></div>
            <div class="divButtonEdit" title="Edit this Storyboard"></div>
            <div class="divButtonDelete" title="Delete this Storyboard"></div>
        </div>

        <div class="clearfix"></div>
    </div>

</div>
</script>



<!-- Comment Input -->
<script type="text/template" id="templateCommentInputs">
@if (!Auth::guest())
<div class="divCommentInputs">
    <textarea class="textareaComment" rows="5" cols="50"></textarea>

    <div class="divUnderTextarea">
        <button class="buttonSaveComment buttonCustom1">Comment</button>
        <button class="buttonCancelComment buttonCustom1">Cancel</button>
        <label class="labelNumCharacters">0/3000</label>
    </div>
</div>
@endif
</script>



<!-- Comment Item -->
<script type="text/template" id="templateCommentItem">
<div class="divCommentItem" data-comment_id="<%- comment_id %>" data-user_id="<%- user_id %>">
    <div class="divLeft">
        <div class="divCommentItemVoteButtons">
            @if (!Auth::guest())
                <div class="divButtonUpvote"></div>
                <div class="divButtonDownvote"></div>
            @endif
        </div>
    </div>

    <div class="divRight">
        <div class="divCommentItemAboveText">
            <div class="divCommentItemUsername">
                <!-- <a href="javascript:void(0);" class="aCommentItemUsername"></a> -->
                <%- username %>
            </div>

            <div class="divCommentItemPoints">Points <%- points %></div>

            @if (!Auth::guest())
                <div class="divCommentItemReply">
                    <a href="javascript:void(0);" class="aCommentItemReply">Reply</a>
                </div>

                <div class="divCommentItemEdit">
                    <a href="javascript:void(0);" class="aCommentItemEdit">Edit</a>
                </div>

                <div class="divCommentItemDelete">
                    <a href="javascript:void(0);" class="aCommentItemDelete">Delete</a>
                </div>
            @endif

            <div class="divCommentItemTime">
                <time class="timeago" datetime="<%- updated_at %>"
                    title="Last updated : <%- updated_at %>"></time>
            </div>
        </div>

        <div class="divCommentItemText"><%- text %></div>

        <div class="divCommentChild"></div>
    </div>

    <div class="clearfix"></div>
</div>
</script>

