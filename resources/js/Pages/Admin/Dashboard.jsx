import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LayoutAdmin from "../../Layouts/Admin";
import {
  faAward,
  faBedPulse,
  faNewspaper,
  faNotesMedical,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { usePage } from "@inertiajs/react";

export default function AdminDashboard() {
  const { data } = usePage().props;
  const formatNumber = (value) => value.toLocaleString("id-ID");
  const summaryItems = [
    {
      label: "Pasien",
      value: Number(data?.banyakPasien ?? 0),
      icon: faBedPulse,
      color: "teal",
    },
    {
      label: "Rekam Gizi",
      value: Number(data?.banyakRekamGizi ?? 0),
      icon: faNotesMedical,
      color: "blue",
    },
    {
      label: "Rekomendasi",
      value: Number(data?.banyakMenuRekomendasi ?? 0),
      icon: faAward,
      color: "amber",
    },
    {
      label: "Menu Makanan",
      value: Number(data?.banyakMenuMakanan ?? 0),
      icon: faUtensils,
      color: "green",
    },
    {
      label: "Informasi",
      value: Number(data?.banyakInformasi ?? 0),
      icon: faNewspaper,
      color: "slate",
    },
  ];

  return (
    <LayoutAdmin>
      <div className="page-stack admin-dashboard">
        <section className="dashboard-hero admin-dashboard-hero">
          <div className="admin-dashboard-hero__content">
            <p className="admin-dashboard-hero__eyebrow">
              Panel Admin Gizi Diabetes
            </p>
            <h1>Dashboard Administrasi</h1>
            <p>Ringkasan data utama aplikasi.</p>
          </div>
        </section>

        <section className="admin-summary-grid" aria-label="Ringkasan data admin">
          {summaryItems.map((item) => (
            <div
              key={item.label}
              className={`admin-summary-card admin-summary-card--${item.color}`}
            >
              <div className="admin-summary-card__top">
                <span className="admin-summary-card__icon">
                  <FontAwesomeIcon icon={item.icon} />
                </span>
                <span className="admin-summary-card__value">
                  {formatNumber(item.value)}
                </span>
              </div>
              <p className="admin-summary-card__label">{item.label}</p>
            </div>
          ))}
        </section>
      </div>
    </LayoutAdmin>
  );
}
