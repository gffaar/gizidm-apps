@extends('app')

@section('content')

<div class="blade-page">

    <div class="blade-toolbar">

        <div>
            <h3 class="blade-title">Data Informasi</h3>
            <p class="blade-subtitle">Kelola informasi diabetes yang tampil di aplikasi.</p>
        </div>

        <a href="{{ route('admin.informasi.create') }}"
           class="btn btn-primary">

            Tambah Informasi

        </a>

    </div>

    <div class="table-responsive">
    <table class="table app-table">

        <tr>
            <th>No</th>
            <th>Gambar</th>
            <th>Judul</th>
        </tr>

        @foreach($data as $item)

        <tr>

            <td>{{ $loop->iteration }}</td>

            <td>

                <img src="{{ asset('storage/'.$item->gambar) }}"
                     class="blade-table-image"
                     alt="{{ $item->judul }}">

            </td>

            <td>{{ $item->judul }}</td>

        </tr>

        @endforeach

    </table>
    </div>

</div>

@endsection
