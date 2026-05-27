import { useForm } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faImage, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

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

  const [preview, setPreview] = useState(
    informasi.gambar ? `/storage/${informasi.gambar}` : null
  );

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

  return (
    <form onSubmit={submit} className="w-full max-w-xl">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Informasi Diabetes</legend>

        <label className="label">Judul Informasi</label>
        <input
          type="text"
          className="input"
          placeholder="Masukkan judul informasi"
          value={data.judul}
          onChange={(e) => setData("judul", e.target.value)}
        />
        {errors.judul && <span className="text-error">{errors.judul}</span>}

        <label className="label">Deskripsi</label>
        <textarea
          className="textarea textarea-bordered min-h-44 w-full"
          placeholder="Tuliskan deskripsi informasi..."
          value={data.deskripsi}
          onChange={(e) => setData("deskripsi", e.target.value)}
        />
        {errors.deskripsi && (
          <span className="text-error">{errors.deskripsi}</span>
        )}

        <label className="label">Gambar</label>
        <label className="upload-box">
          {preview ? (
            <img src={preview} alt="Preview" className="upload-box__preview" />
          ) : (
            <>
              <span className="upload-box__icon">
                <FontAwesomeIcon icon={faImage} />
                <FontAwesomeIcon icon={faPlusCircle} className="upload-box__plus" />
              </span>
              <span className="upload-box__title">Pilih Gambar</span>
              <span className="upload-box__hint">Format JPG, PNG (Maks. 2MB)</span>
            </>
          )}
          <input
            accept="image/*"
            type="file"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
        {errors.gambar && <span className="text-error">{errors.gambar}</span>}

        {progress && (
          <progress className="progress progress-primary w-full" value={progress.percentage} max="100">
            {progress.percentage}%
          </progress>
        )}

        <button className="btn btn-primary mt-4" disabled={processing}>
          <FontAwesomeIcon icon={faFloppyDisk} />
          Simpan
        </button>
      </fieldset>
    </form>
  );
}
