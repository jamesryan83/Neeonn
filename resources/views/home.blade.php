@extends('app')

@section('content')
<div id="divHome">

    <!-- Content 1 -->
    <div id="divHomeContent1">

        <!-- Title -->
        <div id="divTitle">
            <a href="{{ url('/search') }}"><img src="res/images/title_big.png" height="60" /></a>

            <h1>Social Storyboards</h1>
            <h2>Create storyboards and share them with friends</h2>
        </div>


        <div id="divPhoneAndLoginContainer">


            <div id="divPhoneAndLogin">

                <!-- Phone picture -->
                <div id="divPhone">
                    <img id="imgPhone" />
                    <button id="buttonDownloadApp" class="buttonCustom1">Download the App!</button>
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

                <div class="clearfix"></div>

            </div>
        </div>


    </div>


    <!-- Content 2 -->
    <div id="divHomeContent2">
        <div class="divHomeContentInner">

            <div class="divText">
                <div class="divTextInner center">
                    <p>Neeonn is a site for creating storyboard style articles</p>
                    <p>To your storyboards you add scenes which can contain text, images or a mixture of both.  Scenes can be easily edited or rearranged</p>
                    <p>Storyboards can kept private or made public for all to see !</p>
                </div>
            </div>

            <div class="divImage">
                <div></div>
            </div>

            <div class="clearfix"></div>
        </div>
    </div>


    <!-- Content 3 -->
    <div id="divHomeContent3">
        <div class="divHomeContentInner">

            <div class="divImage">
                <div></div>
            </div>

            <div class="divText">
                <div class="divTextInner center">
                    <p>Text and Canvas editing tools let you be creative and display your content in multiple ways</p>
                    <p>Use images from your computer, from the net or from your phone using the Neeonn app</p>
                </div>
            </div>

            <div class="clearfix"></div>
        </div>
    </div>


    <!-- Content 4 -->
    <div id="divHomeContent4">
        <div class="divHomeContentInner">

            <div class="divText">
                <div class="divTextInner center">
                    <p>Scenes combine together to make articles</p>
                    <p>Storyboards created on your phone will appear on the website and vice versa</p>
                </div>
            </div>

            <div class="divImage">
                <div></div>
            </div>

            <div class="clearfix"></div>
        </div>
    </div>


    <!-- Content 5 -->
    <div id="divHomeContent5">
        <button id="buttonLookInside" class="buttonCustom1">Take a Look Inside</button>
    </div>


</div>
@endsection
