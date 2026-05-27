import { usePage } from "@inertiajs/react";
import LayoutUser from "../../../Layouts/User";
import FormRekomendasi from "../../../Forms/Rekomendasi";

export default function UserRekomendasiCreate() {
  const { pengguna, menuMakanan } = usePage().props;
  return (
    <LayoutUser>
      <div className="page-stack">
        <div className="page-header">
          <div className="page-header__content">
            <p className="page-title">Tambah Rekomendasi</p>
            <p className="page-subtitle">Pilih menu makanan harian</p>
          </div>
        </div>
        <FormRekomendasi pengguna={pengguna} makanans={menuMakanan} type="user" />
      </div>
    </LayoutUser>
  );
}
