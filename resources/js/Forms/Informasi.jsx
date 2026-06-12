import { Link, useForm } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { storageUrl } from "../Utils/storageUrl";

export default function FormInformasi({
  informasi = {
    id: "",
    judul: "",
    deskripsi: "",
    gambar: null,
  },
  type = "create",
}) {
  const { data, setData, post, processing, errors, progress } = useForm({
    judul: informasi.judul || "",
    deskripsi: informasi.deskripsi || "",
    gambar: null,
    _method: type === "create" ? "POST" : "PUT",
  });

  const [preview, setPreview] = useState(storageUrl(informasi.gambar, null));

  function submit(e) {
    e.preventDefault();

    if (type === "create") {
      post("/admin/informasi");
    } else {
      post(`/admin/informasi/${informasi.id}`);
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    setData("gambar", file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }

  const cancelHref =
    type === "create" ? "/admin/informasi" : `/admin/informasi/${informasi.id}`;

  return (
    <form onSubmit={submit} className="admin-info-form">
      <fieldset className="admin-info-form-card">
        <legend className="admin-info-form__legend">Informasi Diabetes</legend>

        <div className="admin-info-form__layout">
          <div className="admin-info-form__inputs">
            <div className="admin-form-field">
              <label className="label">Judul Informasi</label>
              <input
                type="text"
                className="input"
                placeholder="Masukkan judul informasi"
                value={data.judul}
                onChange={(e) => setData("judul", e.target.value)}
              />
              {errors.judul && (
                <span className="text-error">{errors.judul}</span>
              )}
            </div>

            <div className="admin-form-field">
              <label className="label">Deskripsi</label>
              <textarea
                className="textarea"
                placeholder="Tuliskan deskripsi informasi..."
                value={data.deskripsi}
                onChange={(e) => setData("deskripsi", e.target.value)}
              />
              {errors.deskripsi && (
                <span className="text-error">{errors.deskripsi}</span>
              )}
            </div>

            {progress && (
              <progress
                className="admin-info-form__progress"
                value={progress.percentage}
                max="100"
              >
                {progress.percentage}%
              </progress>
            )}

            <div className="admin-info-form__actions">
              <button
                className="btn btn-primary admin-info-save-button"
                disabled={processing}
              >
                <FontAwesomeIcon icon={faFloppyDisk} />
                {processing ? "Menyimpan..." : "Simpan Informasi"}
              </button>
              <Link href={cancelHref} className="btn btn-soft">
                Batal
              </Link>
            </div>
          </div>

          <aside className="admin-info-image-panel">
            <div className="admin-info-image-panel__header">
              <h3>Gambar Edukasi</h3>
              <p>Upload gambar pendukung agar artikel edukasi lebih mudah dipahami.</p>
            </div>

            <div className="admin-form-field">
              <label className="label">Upload Gambar</label>
              <div className="admin-info-upload">
                <input
                  accept="image/*"
                  type="file"
                  className="file-input"
                  onChange={handleImageChange}
                />
                <span className="form-hint">
                  Format JPG atau PNG. Gunakan gambar edukasi yang jelas.
                </span>
              </div>
              {errors.gambar && (
                <span className="text-error">{errors.gambar}</span>
              )}
            </div>

            <figure className="admin-info-preview">
              <figcaption>Preview Gambar</figcaption>
              {preview ? (
                <img src={preview} alt="Preview informasi edukasi" />
              ) : (
                <div className="admin-info-preview__empty">
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
