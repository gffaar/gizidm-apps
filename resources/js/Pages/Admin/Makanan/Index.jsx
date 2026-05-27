import { Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import LayoutAdmin from "../../../Layouts/Admin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function AdminMakananIndex() {
  const { makanans, filters } = usePage().props;

  const [search, setSearch] = useState(filters.search || "");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      router.get(
        "/admin/menu-makanan",
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
    <LayoutAdmin>
      <div className="page-stack">
        <div className="page-header">
          <div className="page-header__content">
            <p className="page-title">Data Makanan</p>
            <p className="page-subtitle">Kelola menu makanan dan kandungan gizi</p>
          </div>
        </div>
        <input
          type="text"
          placeholder="Cari Makanan"
          className="input input-bordered w-full"
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="content-card-grid">
          {makanans.data.map((makanan) => (
            <div key={makanan.id} className="card">
              <figure>
                {makanan.gambar ? (
                  <img src={`/storage/${makanan.gambar}`} alt="Makanan" className="list-card-image" />
                ) : (
                  <img src={`/no_image.jpg`} alt="Makanan" className="list-card-image" />
                )}
              </figure>

              <div className="card-body">
                <h2 className="card-title">{makanan.nama}</h2>
                <p>Kategori: {makanan.kategori}</p>
                {/* <p>Kalori: {makanan.kalor}</p>
                <p>Karbohidrat: {makanan.karbohidrat}</p>
                <p>Protein: {makanan.protein}</p>
                <p>Lemak: {makanan.lemak}</p>{" "} */}
                <div className="card-actions justify-end">
                  <Link href={`/admin/menu-makanan/${makanan.id}`} className="btn btn-primary">Lihat</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {makanans.prev_page_url && (
            <button
              onClick={() => goToPage(makanans.prev_page_url)}
              className="btn btn-primary"
            >
              Previous
            </button>
          )}
          {makanans.next_page_url && (
            <button
              onClick={() => goToPage(makanans.next_page_url)}
              className="btn btn-primary"
            >
              Next
            </button>
          )}
        </div>
      </div>
      <div className="fixed bottom-20 right-10">
        <Link
          href="/admin/menu-makanan/create"
          className="btn btn-outline btn-primary btn-circle"
        >
          <FontAwesomeIcon icon={faPlus} />
        </Link>
      </div>
    </LayoutAdmin>
  );
}
