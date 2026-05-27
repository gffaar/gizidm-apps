import { useForm } from "@inertiajs/react";
import { useState } from "react";

export default function FormRekamGizi({
  pengguna = {
    id: "",
    nama: "",
    user_id: "",
    jenis_kelamin: "",
    tanggal_lahir: "",
    tinggi_cm: "",
    berat_kg: "",
  },
  rekamGizi = {
    id: "",
    nama: "",
    usia: "",
    riwayat_diabetes: "",
    pengguna_id: "",
    imt: "",
    status_gizi: "",
    bmr: "",
    tee: "",
    kalori_total: "",
    karbohidrat: "",
    protein: "",
    lemak: "",
    kadar_gula_darah: "",
    tanggal: "",
  },
  type = "admin",
}) {
  function hitungUsia(tanggalLahir) {
    const sekarang = new Date();
    const lahir = new Date(tanggalLahir);

    let usia = sekarang.getFullYear() - lahir.getFullYear();
    const bulan = sekarang.getMonth() - lahir.getMonth();
    const hari = sekarang.getDate() - lahir.getDate();

    // Koreksi jika belum ulang tahun di tahun ini
    if (bulan < 0 || (bulan === 0 && hari < 0)) {
      usia--;
    }

    return usia;
  }

  const { data, setData, post, processing, errors, progress } = useForm({
    nama: rekamGizi.nama || pengguna.user.nama,
    riwayat_diabetes: rekamGizi.riwayat_diabetes || "",
    pengguna_id: rekamGizi.pengguna_id || "",
    berat_kg: pengguna.berat_kg || "",
    tinggi_cm: pengguna.tinggi_cm || "",
    usia: hitungUsia(pengguna.tanggal_lahir) || "",
    jenis_kelamin: pengguna.jenis_kelamin || "",
    kadar_gula_darah: rekamGizi.kadar_gula_darah || "",
    aktivitas: null,
  });

  function submit(e) {
    e.preventDefault();
    if (type === "admin") {
      post(`/admin/pengguna/${pengguna.id}/rekam-gizi`);
    } else {
      post(`/user/rekam-gizi/${rekamGizi.id}`);
    }
  }

  return (
    <form onSubmit={submit}>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Rekam Gizi</legend>

        <label className="label">Umur</label>
        <label className="input">
          <input
            type="number"
            className="grow"
            placeholder="Usia"
            value={data.usia}
            onChange={(e) => setData("usia", e.target.value)}
          />
          Tahun
        </label>
        {errors.usia && <span className="text-error">{errors.usia}</span>}

        <label className="label">Jenis Kelamin</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`btn w-full btn-sm ${
              data.jenis_kelamin === "Laki-laki" ? "btn-primary" : "btn-soft"
            }`}
            onClick={() => setData("jenis_kelamin", "Laki-laki")}
          >
            Laki-Laki
          </button>
          <button
            type="button"
            className={`btn w-full btn-sm ${
              data.jenis_kelamin === "Perempuan" ? "btn-primary" : "btn-soft"
            }`}
            onClick={() => setData("jenis_kelamin", "Perempuan")}
          >
            Perempuan
          </button>
        </div>
        {errors.jenis_kelamin && (
          <span className="text-error">{errors.jenis_kelamin}</span>
        )}

        <label className="label">Berat Badan</label>
        <label className="input">
          <input
            type="number"
            className="grow"
            placeholder="Berat Badan"
            value={data.berat_kg}
            onChange={(e) => setData("berat_kg", e.target.value)}
          />
          kg
        </label>
        {errors.berat_kg && (
          <span className="text-error">{errors.berat_kg}</span>
        )}

        <label className="label">Tinggi Badan</label>
        <label className="input">
          <input
            type="number"
            className="grow"
            placeholder="Tinggi Badan"
            value={data.tinggi_cm}
            onChange={(e) => setData("tinggi_cm", e.target.value)}
          />
          cm
        </label>
        {errors.tinggi_cm && (
          <span className="text-error">{errors.tinggi_cm}</span>
        )}

        <label className="label">Aktivitas</label>
        <select
          defaultValue={data.aktivitas || "Pilih Aktivitas"}
          className="select"
          onChange={(e) => setData("aktivitas", e.target.value)}
        >
          <option disabled={true}>Pilih Aktivitas</option>
          <option>Sangat Ringan</option>
          <option>Ringan</option>
          <option>Sedang</option>
          <option>Berat</option>
        </select>
        {errors.aktivitas && (
          <span className="text-error">{errors.aktivitas}</span>
        )}

        <label className="label">Riwayat Diabetes</label>
        <select
          defaultValue={data.riwayat_diabetes || "Pilih Riwayat Diabetes"}
          className="select"
          onChange={(e) => setData("riwayat_diabetes", e.target.value)}
        >
          <option disabled={true}>Pilih Riwayat Diabetes</option>
          <option>Ya</option>
          <option>Tidak</option>
        </select>
        {errors.riwayat_diabetes && (
          <span className="text-error">{errors.riwayat_diabetes}</span>
        )}

        <label className="label">Kadar Gula Darah</label>
        <label className="input">
          <input
            type="number"
            className="grow"
            placeholder="Kadar Gula Darah"
            value={data.kadar_gula_darah}
            onChange={(e) => setData("kadar_gula_darah", e.target.value)}
          />
          mg/dl
        </label>
        {errors.kadar_gula_darah && (
          <span className="text-error">{errors.kadar_gula_darah}</span>
        )}

        {progress && (
          <progress value={progress.percentage} max="100">
            {progress.percentage}%
          </progress>
        )}

        <button className="btn btn-primary w-full mt-4" disabled={processing}>
          Hitung Sekarang
        </button>
      </fieldset>
    </form>
  );
}
