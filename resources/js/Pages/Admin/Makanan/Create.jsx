import FormMakanan from "../../../Forms/Makanan";
import LayoutAdmin from "../../../Layouts/Admin";

export default function AdminMakananCreate() {
  return (
    <LayoutAdmin>
      <div className="page-stack">
        <div className="page-header">
          <div className="page-header__content">
            <p className="page-title">Tambah Menu Makanan</p>
            <p className="page-subtitle">Lengkapi data kandungan gizi</p>
          </div>
        </div>
        <FormMakanan />
      </div>
    </LayoutAdmin>
  );
}
