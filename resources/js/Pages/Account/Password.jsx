import { usePage } from "@inertiajs/react";
import FormAccountPassword from "../../Forms/AccountPassword";
import LayoutAdmin from "../../Layouts/Admin";
import LayoutUser from "../../Layouts/User";

export default function AccountPassword() {
  const { user } = usePage().props;

  return user.role === "admin" ? (
    <LayoutAdmin>
      <div className="page-stack">
        <div className="page-header">
          <div className="page-header__content">
            <p className="page-title">Ubah Password</p>
            <p className="page-subtitle">Amankan akses akun Anda</p>
          </div>
        </div>
        <FormAccountPassword />
      </div>
    </LayoutAdmin>
  ) : (
    <LayoutUser>
      <div className="page-stack">
        <div className="page-header">
          <div className="page-header__content">
            <p className="page-title">Ubah Password</p>
            <p className="page-subtitle">Amankan akses akun Anda</p>
          </div>
        </div>
        <FormAccountPassword />
      </div>
    </LayoutUser>
  );
}
