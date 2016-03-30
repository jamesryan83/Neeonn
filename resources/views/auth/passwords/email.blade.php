@extends('main')

<!-- Main Content -->
@section('content')

Reset Password

@if (session('status'))
    <div>
        {{ session('status') }}
    </div>
@endif

<form method="POST" action="{{ url('/password/email') }}">
    {!! csrf_field() !!}

    <label>E-Mail Address</label>
    <input type="email" name="email" value="{{ old('email') }}">

    @if ($errors->has('email'))
        <span>
            <strong>{{ $errors->first('email') }}</strong>
        </span>
    @endif

    <button type="submit">Send Password Reset Link</button>
</form>

@endsection
