import { Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import { storageUrl } from "../Utils/storageUrl";

export default function FormMakanan({
  makanan = {
    id:"",
    nama: "",
    kategori: "",
    kalori: "",
    karbohidrat: "",
    protein: "",
    lemak: "",
    satuan: "",
    gambar: null,
  },
  type = "create",
}) {
  const { data, setData, post, processing, errors, progress } = useForm({
    nama: makanan.nama || "",
    kategori: makanan.kategori || "",
    kalori: makanan.kalori || "",
    karbohidrat: makanan.karbohidrat || "",
    protein: makanan.protein || "",
    lemak: makanan.lemak || "",
    satuan: makanan.satuan || "",
    gambar: null,
    _method: type === "create" ? "POST" : "PUT",
  });

  const [preview, setPreview] = useState(storageUrl(makanan.gambar, null));

  function submit(e) {
    e.preventDefault();
    if (type === "create") {
      post("/admin/menu-makanan");
    } else {
      post(`/admin/menu-makanan/${makanan.id}`);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setData("gambar", file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <form onSubmit={submit} className="admin-food-form">
      <fieldset className="admin-food-form-card">
        <legend className="admin-food-form__legend">Menu Makanan</legend>

        <div className="admin-food-form__layout">
          <div className="admin-food-form__inputs">
            <div className="admin-form-field">
              <label className="label">Nama</label>
              <input
                type="text"
                className="input"
                placeholder="Nama makanan"
                value={data.nama}
                onChange={(e) => setData("nama", e.target.value)}
              />
              {errors.nama && <span className="text-error">{errors.nama}</span>}
            </div>

            <div className="admin-form-field">
              <label className="label">Kategori</label>
              <select
                value={data.kategori}
                className="select"
                onChange={(e) => setData("kategori", e.target.value)}
              >
                <option value="">Pilih Kategori</option>
                <option value="Karbo">Karbo</option>
                <option value="Protein">Protein</option>
                <option value="Lemak">Lemak</option>
                <option value="Sayur">Sayur</option>
                <option value="Buah">Buah</option>
                <option value="Lain-lain">Lain-lain</option>
              </select>
              {errors.kategori && (
                <span className="text-error">{errors.kategori}</span>
              )}
            </div>

            <div className="admin-form-field">
              <label className="label">Kalori</label>
              <input
                step="any"
                type="number"
                className="input"
                placeholder="Kalori"
                value={data.kalori}
                onChange={(e) => setData("kalori", e.target.value)}
              />
              {errors.kalori && (
                <span className="text-error">{errors.kalori}</span>
              )}
            </div>

            <div className="admin-form-field">
              <label className="label">Karbohidrat</label>
              <input
                step="any"
                type="number"
                className="input"
                placeholder="Karbohidrat"
                value={data.karbohidrat}
                onChange={(e) => setData("karbohidrat", e.target.value)}
              />
              {errors.karbohidrat && (
                <span className="text-error">{errors.karbohidrat}</span>
              )}
            </div>

            <div className="admin-form-field">
              <label className="label">Protein</label>
              <input
                step="any"
                type="number"
                className="input"
                placeholder="Protein"
                value={data.protein}
                onChange={(e) => setData("protein", e.target.value)}
              />
              {errors.protein && (
                <span className="text-error">{errors.protein}</span>
              )}
            </div>

            <div className="admin-form-field">
              <label className="label">Lemak</label>
              <input
                step="any"
                type="number"
                className="input"
                placeholder="Lemak"
                value={data.lemak}
                onChange={(e) => setData("lemak", e.target.value)}
              />
              {errors.lemak && (
                <span className="text-error">{errors.lemak}</span>
              )}
            </div>

            <div className="admin-form-field admin-form-field--full">
              <label className="label">Satuan</label>
              <input
                type="text"
                className="input"
                placeholder="Contoh: 100 gram, 1 porsi"
                value={data.satuan}
                onChange={(e) => setData("satuan", e.target.value)}
              />
              {errors.satuan && (
                <span className="text-error">{errors.satuan}</span>
              )}
            </div>

            {progress && (
              <progress
                className="admin-food-form__progress admin-form-field--full"
                value={progress.percentage}
                max="100"
              >
                {progress.percentage}%
              </progress>
            )}

            <div className="admin-food-form__actions admin-form-field--full">
              <button
                className="btn btn-primary admin-food-save-button"
                disabled={processing}
              >
                {processing ? "Menyimpan..." : "Simpan"}
              </button>
              <Link href="/admin/menu-makanan" className="btn btn-soft">
                Batal
              </Link>
            </div>
          </div>

          <aside className="admin-food-image-panel">
            <div className="admin-food-image-panel__header">
              <h3>Gambar Makanan</h3>
              <p>Upload gambar untuk membantu pengguna mengenali makanan.</p>
            </div>

            <div className="admin-form-field">
              <label className="label">Upload Gambar</label>
              <div className="admin-food-upload">
                <input
                  accept="image/*"
                  type="file"
                  className="file-input"
                  onChange={handleImageChange}
                />
                <span className="form-hint">
                  Gunakan gambar makanan yang jelas. Format JPG atau PNG.
                </span>
              </div>
              {errors.gambar && (
                <span className="text-error">{errors.gambar}</span>
              )}
            </div>

            <figure className="admin-food-preview">
              <figcaption>Preview Gambar</figcaption>
              {preview ? (
                <img src={preview} alt="Preview makanan" />
              ) : (
                <div className="admin-food-preview__empty">
                  Belum ada gambar dipilih.
                </div>
              )}
            </figure>
          </aside>
        </div>
      </fieldset>
    </form>
  );
}
