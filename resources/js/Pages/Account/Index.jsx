import { Link, router, usePage } from "@inertiajs/react";
import LayoutAdmin from "../../Layouts/Admin";
import Swal from "sweetalert2";
import LayoutUser from "../../Layouts/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faGear, faMedkit, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";

export default function AccountIndex() {
  const { user } = usePage().props;

  const handleLogout = () => {
    Swal.fire({
      title: "Apakah Anda yakin ingin keluar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0f766e",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then((result) => {
      if (result.isConfirmed) {
        router.get("/logout");
      }
    });
  };

  return user.role === "admin" ? (
    <LayoutAdmin>
      <div className="page-stack">
        <div className="page-header">
          <div className="page-header__content">
            <p className="page-title">Profil</p>
            <p className="page-subtitle">Kelola informasi akun admin</p>
          </div>
        </div>
        <div className="card w-full profile-overview-card">
          <figure className="profile-overview-card__figure">
            {user.foto ? (
              <img src={`/storage/${user.foto}`} alt="Foto Profil" className="profile-avatar" />
            ) : (
              <img src={`/no_profile_picture.png`} alt="Foto Profil" className="profile-avatar" />
            )}
          </figure>
          <div className="card-body text-center profile-overview-card__body">
            <p className="profile-overview-card__name">{user.nama}</p>
            <div className="profile-admin-actions">
              <Link href="/informasi-data-pribadi-user" className="btn btn-primary">
                Informasi Data Pribadi User
              </Link>
              <Link href="/account/password" className="btn btn-primary">
                Ubah Password
              </Link>
              <button onClick={handleLogout} className="btn btn-error">
                Keluar
              </button>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  ) : (
    <LayoutUser>
      <div className="page-stack">
        <div className="page-header">
          <div className="page-header__content">
            <p className="page-title">Profil</p>
            <p className="page-subtitle">Kelola akun dan data kesehatan</p>
          </div>
        </div>
        <div className="card w-full profile-overview-card">
          <figure className="profile-overview-card__figure">
            {user.foto ? (
              <img src={`/storage/${user.foto}`} alt="Foto Profil"  className="profile-avatar" />
            ) : (
              <img src={`/no_profile_picture.png`} alt="Foto Profil" className="profile-avatar" />
            )}
          </figure>
          <div className="card-body text-center profile-overview-card__body">
            <p className="profile-overview-card__name">{user.nama}</p>
            <p className="profile-overview-card__meta">{user.email}</p>
            <div className="profile-menu-list">
            <Link href="/informasi-data-pribadi-user" className="profile-action">
              <FontAwesomeIcon icon={faUser} />
              <p className="text-start">Informasi Data Pribadi User</p>
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
            <Link href="/user/rekam-gizi" className="profile-action">
              <FontAwesomeIcon icon={faMedkit} />
              <p className="text-start">Data Kesehatan</p>
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
            <Link href="/account/password" className="profile-action">
              <FontAwesomeIcon icon={faGear} />
              <p className="text-start">Pengaturan</p>
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="profile-action profile-action--danger"
            >
              <FontAwesomeIcon icon={faSignOut} />
              <p className="text-start">Keluar</p>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
            </div>
          </div>
        </div>
      </div>
    </LayoutUser>
  );
}
