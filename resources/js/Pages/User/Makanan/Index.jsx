import { Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import LayoutUser from "../../../Layouts/User";
import { storageUrl } from "../../../Utils/storageUrl";

const DEFAULT_FOOD_IMAGE = "/no_image.jpg";

export default function UserMakananIndex() {
  const { makanans, filters = {} } = usePage().props;
  const items = makanans?.data ?? [];

  const [search, setSearch] = useState(filters.search || "");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      router.get(
        "/user/menu-makanan",
        { search },
        { preserveState: true, replace: true }
      );
    }, 300); // debounce agar tidak terlalu sering request

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const goToPage = (url) => {
    router.visit(url, { preserveState: true });
  };

  return (
    <LayoutUser>
      <div className="page-stack">
        <div className="page-header">
          <div className="page-header__content">
            <p className="page-title">Data Makanan</p>
            <p className="page-subtitle">Cari referensi menu dan kandungan gizi</p>
          </div>
        </div>
        <input
          type="text"
          placeholder="Cari Makanan"
          className="input input-bordered w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="content-card-grid">
          {items.map((makanan) => (
            <div key={makanan.id} className="card">
              <figure>
                <img
                  src={storageUrl(makanan.gambar, DEFAULT_FOOD_IMAGE)}
                  alt={makanan.nama || "Makanan"}
                  className="list-card-image"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = DEFAULT_FOOD_IMAGE;
                  }}
                />
              </figure>

              <div className="card-body">
                <h2 className="card-title">{makanan.nama}</h2>
                <p>Kategori: {makanan.kategori}</p>
                {/* <p>Kalori: {makanan.kalor}</p>
                <p>Karbohidrat: {makanan.karbohidrat}</p>
                <p>Protein: {makanan.protein}</p>
                <p>Lemak: {makanan.lemak}</p>{" "} */}
                <div className="card-actions justify-end">
                  <Link href={`/user/menu-makanan/${makanan.id}`} className="btn btn-primary">Lihat</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length === 0 && (
          <section className="empty-state">
            <p className="empty-state__title">Makanan tidak ditemukan</p>
            <p className="empty-state__text">
              Coba kata kunci lain atau cek kembali data makanan.
            </p>
          </section>
        )}
        <div className="mt-4 flex justify-center gap-2">
          {makanans?.prev_page_url && (
            <button
              onClick={() => goToPage(makanans.prev_page_url)}
              className="btn btn-primary"
            >
              Sebelumnya
            </button>
          )}
          {makanans?.next_page_url && (
            <button
              onClick={() => goToPage(makanans.next_page_url)}
              className="btn btn-primary"
            >
              Berikutnya
            </button>
          )}
        </div>
      </div>
    </LayoutUser>
  );
}
