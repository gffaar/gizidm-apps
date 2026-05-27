@extends('app')

@section('content')

<div class="blade-page">

    <div class="blade-card">
    <h3 class="blade-title">Tambah Informasi</h3>

    <form action="{{ route('admin.informasi.store') }}"
          method="POST"
          enctype="multipart/form-data"
          class="blade-form">

        @csrf

        <div class="blade-field">
            <label class="label">Judul Informasi</label>

            <input type="text"
                   name="judul"
                   class="blade-form-control">
        </div>

        <div class="blade-field">
            <label class="label">Isi Informasi</label>

            <textarea name="isi"
                      rows="5"
                      class="blade-form-control"></textarea>
        </div>

        <div class="blade-field">
            <label class="label">Gambar</label>

            <input type="file"
                   name="gambar"
                   class="blade-form-control">
        </div>

        <button class="btn btn-primary">
            Simpan
        </button>

    </form>
    </div>

</div>

@endsection
