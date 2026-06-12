import { Link, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import FormInformasi from "../../../Forms/Informasi";
import LayoutAdmin from "../../../Layouts/Admin";

export default function AdminInformasiEdit() {
  const { informasi } = usePage().props;

  return (
    <LayoutAdmin>
      <div className="admin-page-stack admin-info-form-page">
        <section className="admin-page-heading admin-info-form-heading">
          <Link
            href={`/admin/informasi/${informasi.id}`}
            className="back-link"
            aria-label="Kembali"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <div>
            <p className="admin-page-heading__eyebrow">
              Kelola Edukasi Diabetes
            </p>
            <h2>Edit Informasi</h2>
            <p>Perbarui artikel edukasi diabetes.</p>
          </div>
        </section>

        <FormInformasi informasi={informasi} type="edit" />
      </div>
    </LayoutAdmin>
  );
}
