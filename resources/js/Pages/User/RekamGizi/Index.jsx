import { Link, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import LayoutUser from "../../../Layouts/User";

export default function UserRekamGiziIndex() {
  const { rekamGizi } = usePage().props;

  return (
    <LayoutUser>
      <div className="page-stack">
        <div className="page-header">
          <Link href={"/"} className="back-link" aria-label="Kembali">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <div className="page-header__content">
            <p className="page-title">Rekam Gizi</p>
            <p className="page-subtitle">Riwayat hasil perhitungan Anda</p>
          </div>
        </div>
        <div className="grid gap-3">
          {rekamGizi.map((rg) => (
            <div key={rg.id} className="card">
              <div className="card-body">
                <h2 className="card-title">{rg.tanggal}</h2>
                <p>IMT: {rg.imt}</p>
                <p>Status Gizi: {rg.status_gizi}</p>
                <div className="card-actions justify-end">
                  <Link
                    href={`/user/rekam-gizi/${rg.id}`}
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
      <div className="fixed bottom-20 right-10">
        <Link
          href={`/user/rekam-gizi/create`}
          className="btn btn-outline btn-primary btn-circle"
        >
          <FontAwesomeIcon icon={faPlus} />
        </Link>
      </div>
    </LayoutUser>
  );
}
