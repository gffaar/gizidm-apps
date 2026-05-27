import { useForm } from "@inertiajs/react";
import { useState } from "react";

export default function FormDaftar() {
  const { data, setData, post, processing, progress, errors } = useForm({
    username: "",
    password: "",
    password_confirmation: "",
    nama: "",
    jenis_kelamin: "Laki-laki",
    tanggal_lahir: "",
    tinggi_cm: "",
    berat_kg: "",
    foto: null,
  });

  const [preview, setPreview] = useState(null);

  function submit(e) {
    e.preventDefault();
    post("/daftar");
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setData("foto", file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <form onSubmit={submit}>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Daftar Akun</legend>

        <label className="label">Username</label>
        <input
          type="text"
          className="input"
          placeholder="Username"
          value={data.username}
          onChange={(e) => setData("username", e.target.value)}
        />
        {errors.username && (
          <span className="text-error">{errors.username}</span>
        )}

        <label className="label">Password</label>
        <input
          type="password"
          className="input"
          placeholder="Password"
          value={data.password}
          onChange={(e) => setData("password", e.target.value)}
        />
        {errors.password && (
          <span className="text-error">{errors.password}</span>
        )}

        <label className="label">Password Konfirmasi</label>
        <input
          type="password"
          className="input"
          placeholder="Password Konfirmasi"
          value={data.password_confirmation}
          onChange={(e) => setData("password_confirmation", e.target.value)}
        />
        {errors.password_confirmation && (
          <span className="text-error">{errors.password_confirmation}</span>
        )}

        <label className="label">Nama</label>
        <input
          type="text"
          className="input"
          placeholder="Nama"
          value={data.nama}
          onChange={(e) => setData("nama", e.target.value)}
        />
        {errors.nama && <span className="text-error">{errors.nama}</span>}

        <label className="label">Jenis Kelamin</label>
        <select
          defaultValue={data.jenis_kelamin}
          className="select"
          onChange={(e) => setData("jenis_kelamin", e.target.value)}
        >
          <option disabled={true}>Pilih Jenis Kelamin</option>
          <option>Laki-laki</option>
          <option>Perempuan</option>
        </select>
        {errors.jenis_kelamin && (
          <span className="text-error">{errors.jenis_kelamin}</span>
        )}
        <label className="label">Tanggal Lahir</label>
        <input
          type="date"
          className="input"
          placeholder="Tanggal Lahir"
          value={data.tanggal_lahir}
          onChange={(e) => setData("tanggal_lahir", e.target.value)}
        />
        {errors.tanggal_lahir && (
          <span className="text-error">{errors.tanggal_lahir}</span>
        )}

        <label className="label">Tinggi CM</label>
        <input
          step="any"
          type="number"
          className="input"
          placeholder="Tinggi CM"
          value={data.tinggi_cm}
          onChange={(e) => setData("tinggi_cm", e.target.value)}
        />
        {errors.tinggi_cm && (
          <span className="text-error">{errors.tinggi_cm}</span>
        )}

        <label className="label">Berat KG</label>
        <input
          step="any"
          type="number"
          className="input"
          placeholder="Berat KG"
          value={data.berat_kg}
          onChange={(e) => setData("berat_kg", e.target.value)}
        />
        {errors.berat_kg && (
          <span className="text-error">{errors.berat_kg}</span>
        )}

        <label className="label">Foto</label>
        <input
          accept="image/*"
          type="file"
          className="file-input"
          onChange={handleImageChange}
        />
        {errors.foto && <span className="text-error">{errors.foto}</span>}

        {preview && (
          <div className="mb-4">
            <p className="text-sm mb-1">Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="w-full object-cover rounded"
            />
          </div>
        )}

        {progress && (
          <progress value={progress.percentage} max="100">
            {progress.percentage}%
          </progress>
        )}

        <button className="btn btn-primary w-full mt-4" disabled={processing}>
          Simpan
        </button>
      </fieldset>
    </form>
  );
}
