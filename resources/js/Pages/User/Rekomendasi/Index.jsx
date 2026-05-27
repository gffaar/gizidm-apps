import { Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import LayoutUser from "../../../Layouts/User";

const filterOptions = [
  { label: "Semua", value: "" },
  { label: "Pagi", value: "Pagi" },
  { label: "Siang", value: "Siang" },
  { label: "Malam", value: "Malam" },
];

export default function UserRekomendasiIndex() {
  const { menuRekomendasi, filters } = usePage().props;
  const [search, setSearch] = useState(filters.search || "");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      router.get(
        `/user/menu-rekomendasi`,
        { search },
        { preserveState: true, replace: true },
      );
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <LayoutUser>
      <div className="page-stack">
        <div className="page-header">
          <Link href={"/"} className="back-link" aria-label="Kembali">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <div className="page-header__content">
            <p className="page-title">Rekomendasi Makanan</p>
            <p className="page-subtitle">Menu makanan sesuai kebutuhan Anda</p>
          </div>
        </div>

        <div className="segmented-control">
          {filterOptions.map((option) => (
            <button
              key={option.label}
              className={`btn ${
                search === option.value ? "btn-primary" : "btn-soft"
              }`}
              onClick={() => setSearch(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <section className="card">
          <div className="card-body">
            {(menuRekomendasi ?? []).length === 0 ? (
              <p className="page-subtitle text-center">
                Belum ada menu rekomendasi.
              </p>
            ) : (
              <div className="grid gap-3">
                {menuRekomendasi.map((menu) => {
                  const makanan = menu.menu_makanan;
                  const gambar = makanan.gambar
                    ? `/storage/${makanan.gambar}`
                    : `/no_image.jpg`;

                  return (
                    <Link
                      key={menu.id}
                      href={`/user/menu-makanan/${makanan.id}`}
                      className="flex items-center gap-3 rounded border border-base-300 bg-base-100 p-3 transition hover:border-primary"
                    >
                      <img
                        src={gambar}
                        alt={makanan.nama}
                        className="h-20 w-20 rounded object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold">{makanan.nama}</p>
                        <p className="page-subtitle">
                          {menu.jumlah} x {makanan.satuan}
                        </p>
                        <p className="font-bold text-primary">
                          {makanan.kalori * menu.jumlah} kkal
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </LayoutUser>
  );
}
