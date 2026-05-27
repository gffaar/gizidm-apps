import { Link, router, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faChevronRight,
  faHeartbeat,
} from "@fortawesome/free-solid-svg-icons";
import LayoutUser from "../../../Layouts/User";

export default function UserInformasiIndex() {
  const { informasis } = usePage().props;

  const goToPage = (url) => {
    router.visit(url, { preserveState: true });
  };

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    router.visit("/");
  };

  return (
    <LayoutUser>
      <div className="page-stack">
        <div className="page-header">
          <button type="button" onClick={goBack} className="back-link" aria-label="Kembali">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="page-header__content">
            <p className="page-title">Informasi</p>
            <p className="page-subtitle">Artikel edukasi diabetes</p>
          </div>
        </div>

        <section className="info-hero">
          <div className="info-hero__content">
            <p className="info-hero__title">Informasi Diabetes</p>
            <p className="info-hero__text">
              Temukan berbagai informasi seputar pola makan sehat, olahraga, dan
              tips menjaga gula darah.
            </p>
          </div>
          <div className="info-hero__icon">
            <FontAwesomeIcon icon={faHeartbeat} />
          </div>
        </section>

        <section className="page-stack">
          <p className="section-title">Artikel Terbaru</p>
          <div className="info-list">
            {informasis.data.map((informasi) => (
              <Link
                href={`/user/informasi/${informasi.id}`}
                key={informasi.id}
                className="info-list-card"
              >
                <img
                  src={
                    informasi.gambar
                      ? `/storage/${informasi.gambar}`
                      : "/no_image.jpg"
                  }
                  alt={informasi.judul}
                  className="info-list-card__image"
                />
                <div className="info-list-card__body">
                  <h2 className="info-list-card__title">{informasi.judul}</h2>
                  <p className="info-list-card__text">{informasi.deskripsi}</p>
                  <p className="info-list-card__date">
                    {new Date(informasi.created_at).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="info-list-card__arrow"
                />
              </Link>
            ))}
          </div>
        </section>

        {informasis.data.length === 0 && (
          <p className="py-8 text-center text-slate-500">
            Belum ada informasi.
          </p>
        )}

        <div className="mt-4 flex justify-center gap-2">
          {informasis.prev_page_url && (
            <button
              onClick={() => goToPage(informasis.prev_page_url)}
              className="btn btn-primary"
            >
              Previous
            </button>
          )}
          {informasis.next_page_url && (
            <button
              onClick={() => goToPage(informasis.next_page_url)}
              className="btn btn-primary"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </LayoutUser>
  );
}
