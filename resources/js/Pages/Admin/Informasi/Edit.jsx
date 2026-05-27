import { Link, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import FormInformasi from "../../../Forms/Informasi";
import LayoutAdmin from "../../../Layouts/Admin";

export default function AdminInformasiEdit() {
  const { informasi } = usePage().props;

  return (
    <LayoutAdmin>
      <div className="page-stack">
        <div className="page-header">
          <Link
            href={`/admin/informasi/${informasi.id}`}
            className="back-link"
            aria-label="Kembali"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <div className="page-header__content">
            <p className="page-title">Edit Informasi</p>
            <p className="page-subtitle">Perbarui artikel edukasi diabetes</p>
          </div>
        </div>
        <FormInformasi informasi={informasi} type="edit" />
      </div>
    </LayoutAdmin>
  );
}
