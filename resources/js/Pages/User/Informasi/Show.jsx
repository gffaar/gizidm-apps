import { Link, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import LayoutUser from "../../../Layouts/User";
import { storageUrl } from "../../../Utils/storageUrl";

const DEFAULT_INFO_IMAGE = "/no_image.jpg";

export default function UserInformasiShow() {
  const { informasi } = usePage().props;
  const gambar = storageUrl(informasi.gambar, DEFAULT_INFO_IMAGE);

  return (
    <LayoutUser>
      <div className="page-stack">
        <div className="page-header">
          <Link href="/user/informasi" className="back-link" aria-label="Kembali">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <div className="page-header__content">
            <p className="page-title">Detail Informasi</p>
            <p className="page-subtitle">Artikel edukasi diabetes</p>
          </div>
        </div>

        <article className="card">
          <figure>
            <img
              src={gambar}
              alt={informasi.judul}
              className="list-card-image"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = DEFAULT_INFO_IMAGE;
              }}
            />
          </figure>
          <div className="card-body">
            <h1 className="card-title">{informasi.judul}</h1>
            <p className="text-sm text-slate-500">
              {new Date(informasi.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="whitespace-pre-line leading-relaxed">{informasi.deskripsi}</p>
          </div>
        </article>
      </div>
    </LayoutUser>
  );
}
