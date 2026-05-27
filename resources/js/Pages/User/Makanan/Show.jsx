import { Link, usePage } from "@inertiajs/react";
import LayoutUser from "../../../Layouts/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function UserMakananShow() {
  const { makanan } = usePage().props;
  const gambar = makanan.gambar ? `/storage/${makanan.gambar}` : `/no_image.jpg`;

  return (
    <LayoutUser>
      <div className="page-stack">
        <div className="page-header">
          <Link
            href={"/user/menu-makanan"}
            className="back-link"
            aria-label="Kembali"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <div className="page-header__content">
            <p className="page-title">Detail Makanan</p>
            <p className="page-subtitle">Informasi kandungan gizi menu</p>
          </div>
        </div>

        <div className="card">
          <figure>
            <img src={gambar} alt={makanan.nama} className="list-card-image" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{makanan.nama}</h2>
            <div className="grid gap-3">
              <div className="flex items-center justify-between border-b border-base-300 pb-3">
                <span>Kategori</span>
                <span className="font-bold">{makanan.kategori}</span>
              </div>
              <div className="flex items-center justify-between border-b border-base-300 pb-3">
                <span>Kalori</span>
                <span className="font-bold text-primary">
                  {makanan.kalori} kkal
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-base-300 pb-3">
                <span>Karbohidrat</span>
                <span className="font-bold">{makanan.karbohidrat} g</span>
              </div>
              <div className="flex items-center justify-between border-b border-base-300 pb-3">
                <span>Protein</span>
                <span className="font-bold">{makanan.protein} g</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Lemak</span>
                <span className="font-bold">{makanan.lemak} g</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutUser>
  );
}
