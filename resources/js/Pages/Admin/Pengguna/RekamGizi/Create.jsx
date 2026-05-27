import { usePage } from "@inertiajs/react";
import FormRekamGizi from "../../../../Forms/RekamGizi";
import LayoutAdmin from "../../../../Layouts/Admin";

export default function AdminPenggunaRekamGiziCreate() {
  const { pengguna } = usePage().props;
  return (
    <LayoutAdmin>
      <div className="page-stack">
        <div className="page-header">
          <div className="page-header__content">
            <p className="page-title">Rekam Gizi Pasien</p>
            <p className="page-subtitle">Isi data pengukuran pasien</p>
          </div>
        </div>
        <FormRekamGizi pengguna={pengguna} />
      </div>
    </LayoutAdmin>
  );
}
