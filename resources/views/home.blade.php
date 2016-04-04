@extends('app')

@section('content')

<!-- background image -->
<div id="divBackgroundImage">
    <img id="imgBackground" src="../../res/images/background_home.png" />
</div>


<!-- content -->
<div id="divHome">

    <!-- Title -->
    <div id="divTitle">
        <a href="{{ url('/search') }}"><img src="res/images/title_big.png" height="60" /></a>

        <h1>Blah Blah Blah</h1>
        <h2>Something Something Blah</h2>
    </div>



    <!-- Phone picture -->
    <div id="divPhone">
        <img src="res/images/phone.png" height="400" />
    </div>



    <!-- Forms -->
    <div id="divLoginRegister">

        <!-- Login -->
        <div id="divLoginForm">
            <h2>Login</h1>
            <hr>

            <form method="POST" action="{{ url('/login') }}">
                {!! csrf_field() !!}

                <table id="tableLogin">
                    <tr>
                        <td><label>Email</label></td>
                        <td><input type="email" name="email" value="{{ old('email') }}"></td>
                    </tr>

                    <tr>
                        <td><label>Password</label></td>
                        <td><input type="password" name="password"></td>
                    </tr>

                    <tr>
                        <td colspan="2"><button type="submit" class="buttonCustom1">Login</button></td>
                    </tr>

                    <!--<td><a href="{{-- {{ url('/password/reset') }} --}}">Forgot Your Password?</a></td> -->
                </table>
            </form>
        </div>




        <!-- Register -->
        <div id="divRegisterForm">
            <h2>Create Account</h1>
            <hr>

            <form method="POST" action="{{ url('/register') }}">
                {!! csrf_field() !!}

                <table id="tableRegister">
                    <tr>
                        <td><label>Username</label></td>
                        <td><input type="text" name="username" value="{{ old('username') }}"></td>
                    </tr>

                    <tr>
                        <td><label>Email</label></td>
                        <td><input type="email" name="email" value="{{ old('email') }}"></td>
                    </tr>

                    <tr>
                        <td><label>Password</label></td>
                        <td><input type="password" name="password"></td>
                    </tr>

                    <tr>
                        <td colspan="2"><button type="submit" class="buttonCustom1">Create Account</button></td>
                    </tr>
                </table>
            </form>
        </div>



        <div id="divErrors">

            <!-- Login Errors -->
            @if ($errors->has('email'))
                <p>{{ $errors->first('email') }}</p>
            @endif

            @if ($errors->has('password'))
                <p>{{ $errors->first('password') }}</p>
            @endif

            @if ($errors->has('username'))
                <p>{{ $errors->first('username') }}</p>
            @endif

        </div>

    </div>



</div>

@endsection
