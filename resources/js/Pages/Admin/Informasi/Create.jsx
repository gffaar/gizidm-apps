import { Link } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import FormInformasi from "../../../Forms/Informasi";
import LayoutAdmin from "../../../Layouts/Admin";

export default function AdminInformasiCreate() {
  return (
    <LayoutAdmin>
      <div className="admin-page-stack admin-info-form-page">
        <section className="admin-page-heading admin-info-form-heading">
          <Link
            href="/admin/informasi"
            className="back-link"
            aria-label="Kembali"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <div>
            <p className="admin-page-heading__eyebrow">
              Kelola Edukasi Diabetes
            </p>
            <h2>Tambah Informasi</h2>
            <p>Tambahkan artikel edukasi diabetes.</p>
          </div>
        </section>

        <FormInformasi />
      </div>
    </LayoutAdmin>
  );
}
