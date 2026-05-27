import { Link, usePage } from "@inertiajs/react";
import LayoutAdmin from "../../Layouts/Admin";
import LayoutUser from "../../Layouts/User";

export default function AccountEdit() {
  const { user } = usePage().props;
  const Layout = user.role === "admin" ? LayoutAdmin : LayoutUser;

  return (
    <Layout>
      <div className="page-stack">
        <div className="page-header">
          <div className="page-header__content">
            <p className="page-title">Account</p>
            <p className="page-subtitle">Halaman ini sudah dipindahkan ke Account</p>
          </div>
        </div>
        <Link href="/informasi-data-pribadi-user" className="btn btn-primary">
          Buka Informasi Data Pribadi User
        </Link>
      </div>
    </Layout>
  );
}
