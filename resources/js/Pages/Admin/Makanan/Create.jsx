import FormMakanan from "../../../Forms/Makanan";
import LayoutAdmin from "../../../Layouts/Admin";

export default function AdminMakananCreate() {
  return (
    <LayoutAdmin>
      <div className="admin-page-stack admin-food-form-page">
        <section className="admin-page-heading admin-food-form-heading">
          <p className="admin-page-heading__eyebrow">Kelola Data Makanan</p>
          <h2>Tambah Menu Makanan</h2>
          <p>Lengkapi data makanan dan kandungan gizi yang digunakan sistem.</p>
        </section>

        <FormMakanan />
      </div>
    </LayoutAdmin>
  );
}
