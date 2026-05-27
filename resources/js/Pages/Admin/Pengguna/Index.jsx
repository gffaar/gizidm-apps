import { Link, router, usePage } from "@inertiajs/react";
import LayoutAdmin from "../../../Layouts/Admin";
import { useEffect, useState } from "react";

export default function AdminPenggunaIndex() {
  const { pasiens, filters } = usePage().props;

  const [search, setSearch] = useState(filters.search || "");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      router.get(
        "/admin/pengguna",
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
    <>
      <LayoutAdmin>
        <div className="page-stack">
          <div className="page-header">
            <div className="page-header__content">
              <p className="page-title">Data Pasien</p>
              <p className="page-subtitle">Pantau dan kelola profil pasien</p>
            </div>
          </div>
          <input
            type="text"
            placeholder="Cari Pasien"
            className="input input-bordered w-full"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="content-card-grid">
            {pasiens.data.map((pasien) => (
              <div key={pasien.id} className="card">
              <figure>
                {pasien.user.foto ? (
                  <img src={`/storage/${pasien.user.foto}`} alt="Foto Profil" className="list-card-image" />
                ) : (
                  <img src={`/no_profile_picture.png`} alt="Foto Profil" className="list-card-image" />
                )}
              </figure>
                <div className="card-body">
                  <h2 className="card-title">{pasien.user.nama}</h2>
                  <p>Jenis Kelamin: {pasien.jenis_kelamin}</p>
                  <p>Tanggal Lahir: {pasien.tanggal_lahir}</p>
                  <div className="card-actions justify-end">
                    <Link
                      href={`/admin/pengguna/${pasien.id}`}
                      className="btn btn-primary"
                    >
                      Lihat
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {pasiens.prev_page_url && (
            <button
              onClick={() => goToPage(pasiens.prev_page_url)}
              className="btn btn-primary"
            >
              Previous
            </button>
          )}
          {pasiens.next_page_url && (
            <button
              onClick={() => goToPage(pasiens.next_page_url)}
              className="btn btn-primary"
            >
              Next
            </button>
          )}
        </div>
      </LayoutAdmin>
    </>
  );
}
