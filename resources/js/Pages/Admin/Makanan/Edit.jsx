import { usePage } from "@inertiajs/react";
import FormMakanan from "../../../Forms/Makanan";
import LayoutAdmin from "../../../Layouts/Admin";

export default function AdminMakananEdit() {
  const { makanan } = usePage().props;

  return (
    <LayoutAdmin>
      <div className="page-stack">
        <div className="page-header">
          <div className="page-header__content">
            <p className="page-title">Ubah Menu Makanan</p>
            <p className="page-subtitle">Perbarui data kandungan gizi</p>
          </div>
        </div>
        <FormMakanan makanan={makanan} type="edit" />
      </div>
    </LayoutAdmin>
  );
}
