@extends('account')

@section('contentAccount')

<!-- Account Settings -->
<div id="divContentSettings">

    <div id="divSettingsInputs">

        <table>
            <tr>
                <td><label>Full Name</label></td>
                <td><input id="inputAccountSettingsFullName" value="{{ $user->fullname }}"></td>
            </tr>

            <tr>
                <td><label>Username</label></td>
                <td><input id="inputAccountSettingsUsername" value="{{ $user->username }}"></td>
            </tr>

            <tr>
                <td><label>Email</label></td>
                <td><input id="inputAccountSettingsEmail" type="email" value="{{ $user->email }}"></td>
            </tr>

            <tr>
                <td><label>Website</label></td>
                <td><input id="inputAccountSettingsWebsite" value="{{ $user->website }}"></td>
            </tr>

            <tr>
                <td><label>Location</label></td>
                <td><input id="inputAccountSettingsLocation" value="{{ $user->location }}"></td>
            </tr>

            <tr>
                <td><label>Summary</label></td>
                <td><input id="inputAccountSettingsSummary" value="{{ $user->summary }}"></td>
            </tr>

            <tr>
                <td><label>Password</label></td>
                <td><a href="{{ url('/account/change-password') }}">Change Password</a></td>
            </tr>
        </table>

    </div>

    <div id="divSettingsButtons">
        <button id="buttonSettingsSave" class="buttonCustom2">Save Changes</button>
        @if ($user->is_active)
            <button id="buttonSettingsDisable" class="buttonCustom1">Disable Account</button>
        @else
            <button id="buttonSettingsEnable" class="buttonCustom1">Enable Account</button>
        @endif
        <button id="buttonSettingsDelete" class="buttonCustom3">Delete Account</button>
    </div>
</div>

@endsection
