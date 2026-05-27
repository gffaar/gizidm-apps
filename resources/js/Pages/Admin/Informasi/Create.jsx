import FormInformasi from "../../../Forms/Informasi";
import LayoutAdmin from "../../../Layouts/Admin";

export default function AdminInformasiCreate() {
  return (
    <LayoutAdmin>
      <div className="page-stack">
        <div className="page-header">
          <div className="page-header__content">
            <p className="page-title">Tambah Informasi</p>
            <p className="page-subtitle">Tambahkan artikel edukasi diabetes</p>
          </div>
        </div>
        <FormInformasi />
      </div>
    </LayoutAdmin>
  );
}
