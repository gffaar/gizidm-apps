import { useForm } from "@inertiajs/react";

export default function FormRekomendasi({
  pengguna = {
    id,
    user_id,
    jenis_kelamin,
    tanggal_lahir,
    tinggi_cm,
    berat_kg,
  },
  rekomendasi = {
    id: 0,
    pengguna_id: 0,
    menu_makanan_id: 0,
    jumlah: 1,
    waktu_makan: "",
  },
  makanans = [
    {
      id: 0,
      kategori: 0,
      kalori: 0,
      karbohidrat: 0,
      protein: 0,
      lemak: 0,
      satuan: "",
      gambar: null,
    },
  ],
  type = "admin",
}) {
  const { data, setData, post, put, processing, errors, progress } = useForm({
    pengguna_id: pengguna.id,
    menu_makanan_id: rekomendasi.menu_makanan_id,
    jumlah: rekomendasi.jumlah,
    waktu_makan: rekomendasi.waktu_makan,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type == "admin") {
      post(`/admin/pengguna/${pengguna.id}/menu-rekomendasi`);
    } else {
      post(`/user/menu-rekomendasi`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Menu Rekomendasi</legend>

        <label className="label">Makanan</label>
        <select
          defaultValue={data.menu_makanan_id || "Pilih Makanan"}
          className="select"
          onChange={(e) => setData("menu_makanan_id", e.target.value)}
        >
          <option disabled={true}>Pilih Makanan</option>
          {makanans.map((makanan) => (
            <option key={makanan.id} value={makanan.id}>
              {makanan.nama} ({makanan.kalori} kalori)
            </option>
          ))}
        </select>
        {errors.menu_makanan_id && (
          <span className="text-error">{errors.menu_makanan_id}</span>
        )}

        <label className="label">Jumlah</label>
        <input
          type="number"
          step="any"
          className="input"
          placeholder="Jumlah"
          value={data.jumlah}
          onChange={(e) => setData("jumlah", e.target.value)}
        />
        {errors.jumlah && <span className="text-error">{errors.jumlah}</span>}

        <label className="label">Waktu Makan</label>
        <select
          defaultValue={data.waktu_makan || "Pilih Waktu Makan"}
          className="select"
          onChange={(e) => setData("waktu_makan", e.target.value)}
        >
          <option disabled={true}>Pilih Waktu Makan</option>
          <option>Pagi</option>
          <option>Siang</option>
          <option>Malam</option>
        </select>
        {errors.waktu_makan && (
          <span className="text-error">{errors.waktu_makan}</span>
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
