import { Link, router, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import LayoutAdmin from "../../../Layouts/Admin";

export default function AdminInformasiIndex() {
  const { informasis, filters } = usePage().props;
  const [search, setSearch] = useState(filters.search || "");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      router.get(
        "/admin/informasi",
        { search },
        { preserveState: true, replace: true }
      );
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const goToPage = (url) => {
    router.visit(url, { preserveState: true });
  };

  return (
    <LayoutAdmin>
      <div className="page-stack">
        <div className="page-header">
          <div className="page-header__content">
            <p className="page-title">Data Informasi</p>
            <p className="page-subtitle">Kelola artikel edukasi diabetes</p>
          </div>
        </div>

        <input
          type="text"
          placeholder="Cari informasi"
          className="input input-bordered w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="info-hero">
          <div>
            <p className="info-hero__title">Informasi Diabetes</p>
            <p className="info-hero__text">
              Tambahkan artikel tentang pola makan sehat, olahraga, dan tips menjaga gula darah.
            </p>
          </div>
        </div>

        <div className="info-list">
          {informasis.data.map((informasi) => (
            <Link
              href={`/admin/informasi/${informasi.id}`}
              key={informasi.id}
              className="info-list-card"
            >
              <img
                src={informasi.gambar ? `/storage/${informasi.gambar}` : "/no_image.jpg"}
                alt={informasi.judul}
                className="info-list-card__image"
              />
              <div className="info-list-card__body">
                <h2 className="info-list-card__title">{informasi.judul}</h2>
                <p className="info-list-card__text">{informasi.deskripsi}</p>
                <p className="info-list-card__date">
                  {new Date(informasi.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <FontAwesomeIcon icon={faChevronRight} className="info-list-card__arrow" />
            </Link>
          ))}
        </div>

        {informasis.data.length === 0 && (
          <p className="py-8 text-center text-slate-500">Belum ada informasi.</p>
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

      <div className="fixed bottom-20 right-10">
        <Link
          href="/admin/informasi/create"
          className="btn btn-outline btn-primary btn-circle"
        >
          <FontAwesomeIcon icon={faPlus} />
        </Link>
      </div>
    </LayoutAdmin>
  );
}
