@extends('main')

@section('contentMain')

<!-- Change Password -->
<div id="divAccountChangePassword">

    <h1 class="h1PageHeading">Change Password</h1>
    <hr>

    <table>
        <tr>
            <td><label>Old Password</label></td>
            <td><input type="password" id="inputChangePasswordOld"></td>
        </tr>

        <tr>
            <td><label>New Password</label></td>
            <td><input type="password" id="inputChangePasswordNew"></td>
        </tr>

        <tr>
            <td><label>Confirm New Password</label></td>
            <td><input type="password" id="inputChangePasswordNewConfirmation"></td>
        </tr>

        <tr>
            <td><button id="buttonReturn" class="buttonCustom1">Return to Account</button></td>
            <td><button id="buttonChangePassword" class="buttonCustom2">Save</button></td>
        </tr>
    </table>
</div>
@endsection
