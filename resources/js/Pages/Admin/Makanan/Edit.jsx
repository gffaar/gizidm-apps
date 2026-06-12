import { usePage } from "@inertiajs/react";
import FormMakanan from "../../../Forms/Makanan";
import LayoutAdmin from "../../../Layouts/Admin";

export default function AdminMakananEdit() {
  const { makanan } = usePage().props;

  return (
    <LayoutAdmin>
      <div className="admin-page-stack admin-food-form-page">
        <section className="admin-page-heading admin-food-form-heading">
          <p className="admin-page-heading__eyebrow">Kelola Data Makanan</p>
          <h2>Ubah Menu Makanan</h2>
          <p>Perbarui informasi makanan dan kandungan gizi yang tersimpan.</p>
        </section>

        <FormMakanan makanan={makanan} type="edit" />
      </div>
    </LayoutAdmin>
  );
}
