import { usePage } from "@inertiajs/react";
import LayoutAdmin from "../../../../Layouts/Admin";
import FormRekomendasi from "../../../../Forms/Rekomendasi";

export default function AdminPenggunaRekomendasiCreate() {
  const { pengguna, menuMakanan } = usePage().props;
  return (
    <LayoutAdmin>
      <div className="page-stack">
        <div className="page-header">
          <div className="page-header__content">
            <p className="page-title">Tambah Rekomendasi</p>
            <p className="page-subtitle">Pilih menu untuk pasien</p>
          </div>
        </div>
        <FormRekomendasi pengguna={pengguna} makanans={menuMakanan} />
      </div>
    </LayoutAdmin>
  );
}
