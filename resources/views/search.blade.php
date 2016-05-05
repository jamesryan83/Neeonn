@extends('main')

@section('contentMain')

<!-- Search Page -->
<div id="divSearch">

    <div id="divSearchControls">

        <!-- Search Bar -->
        <div id="divSearchBar">
            <div id="divIconSearch"></div>
            <input id="inputSearchTerm" class="inputCustom1" placeholder="Search Everything..." />
            <button id="buttonSearchGo" class="buttonCustom1">Search</button>
        </div>


        <!-- Search Properties -->
        <div id="divSearchProperties">
            <div id="divSearchSelects">
                <label>Category</label>
                <select id="selectSearchCategory"></select>

                <label>Sort by</label>
                <select id="selectSearchSortBy"></select>
            </div>

            <div id="divSearchCheckBoxes">
                <input type="checkbox" id="checkboxSearchTitles"
                    class="css-checkbox" checked />
                <label for="checkboxSearchTitles" class="css-label">Titles</label>

                <input type="checkbox" id="checkboxSearchUsernames"
                    class="css-checkbox"/>
                <label for="checkboxSearchUsernames" class="css-label">Usernames</label>

                <input type="checkbox" id="checkboxSearchText"
                    class="css-checkbox" />
                <label for="checkboxSearchText" class="css-label">Text</label>
            </div>
        </div>
    </div>

    <hr>

    <!-- No results message -->
    <div id="divNoResults">
        <label>No Results</label>
    </div>


    <!-- Loading -->
    <div id="divLoading">
        <img class="center" src="{{ asset('res/loading_hourglass2.svg') }}" height=40 width=40  />
    </div>


    <!-- Search results -->
    <div id="divSearchResults">

    </div>

</div>


@endsection
