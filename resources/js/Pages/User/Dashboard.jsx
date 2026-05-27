import { Link, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  faBowlFood,
  faCalculator,
  faClockRotateLeft,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import LayoutUser from "../../Layouts/User";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function calculateAge(tanggalLahir) {
  if (!tanggalLahir) {
    return null;
  }

  const birthDate = new Date(tanggalLahir);
  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

function calculateBmi(weight, height) {
  const berat = Number(weight);
  const tinggi = Number(height);

  if (!berat || !tinggi || tinggi <= 0) {
    return null;
  }

  const tinggiMeter = tinggi / 100;
  return (berat / (tinggiMeter * tinggiMeter)).toFixed(2);
}

function calculateBmr(weight, height, age, gender) {
  const berat = Number(weight);
  const tinggi = Number(height);
  const umur = Number(age);

  if (!berat || !tinggi || !umur || !gender) {
    return null;
  }

  if (gender === "Laki-laki") {
    return Math.round(66 + 13.7 * berat + 5 * tinggi - 6.8 * umur);
  }

  if (gender === "Perempuan") {
    return Math.round(655 + 9.6 * berat + 1.8 * tinggi - 4.7 * umur);
  }

  return null;
}

export default function UserDashboard() {
  const { rekamGiziTerbaru, pengguna, profilUser, user } = usePage().props;
  const kalori = rekamGiziTerbaru ? parseInt(rekamGiziTerbaru.kalori_total) : 0;
  const gulaDarah = rekamGiziTerbaru ? rekamGiziTerbaru.kadar_gula_darah : 0;
  const profile = {
    berat: profilUser?.berat_kg ?? pengguna?.berat_kg ?? null,
    tinggi: profilUser?.tinggi_cm ?? pengguna?.tinggi_cm ?? null,
    umur:
      profilUser?.umur ??
      calculateAge(profilUser?.tanggal_lahir || pengguna?.tanggal_lahir),
    jenisKelamin: profilUser?.jenis_kelamin || pengguna?.jenis_kelamin || null,
  };
  const bmi = calculateBmi(profile.berat, profile.tinggi);
  const bmr = calculateBmr(
    profile.berat,
    profile.tinggi,
    profile.umur,
    profile.jenisKelamin
  );
  const incompleteProfileText = "Lengkapi data profil";
  const gulaDarahChartData = {
    labels: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"],
    datasets: [
      {
        label: "Kadar Gula (mg/dL)",
        data: [180, 165, 150, 145, 135],
        borderColor: "#0f766e",
        backgroundColor: "rgba(15, 118, 110, 0.1)",
        borderWidth: 2,
        fill: true,
        pointBackgroundColor: "#0f766e",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 4,
        tension: 0.35,
      },
    ],
  };
  const gulaDarahChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          boxHeight: 8,
          boxWidth: 8,
          color: "#64748b",
          font: {
            size: 11,
            weight: "600",
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `Kadar Gula: ${context.raw} mg/dL`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#64748b",
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: "rgba(100, 116, 139, 0.18)",
        },
        ticks: {
          color: "#64748b",
          font: {
            size: 11,
          },
        },
      },
    },
  };
  const menuItems = [
    {
      href: "/user/rekam-gizi/create",
      label: "Hitung Gizi",
      icon: faCalculator,
      color: "green",
    },
    {
      href: "/user/menu-rekomendasi",
      label: "Rekomendasi Makanan",
      icon: faBowlFood,
      color: "orange",
    },
    {
      href: "/user/informasi",
      label: "Sistem Informasi",
      icon: faNewspaper,
      color: "blue",
    },
    {
      href: "/user/rekam-gizi",
      label: "Riwayat",
      icon: faClockRotateLeft,
      color: "green",
    },
  ];

  return (
    <LayoutUser>
      <div className="page-stack dashboard-page">
        <section className="dashboard-hero">
          <div>
            <p>Aplikasi Gizi Diabetes</p>
            <h1 className="text-2xl font-bold">
              Halo, {pengguna?.user?.nama || user?.nama}
            </h1>
            <p>Jaga pola makan, jaga kesehatan.</p>
          </div>
        </section>

        <section className="metric-grid" aria-label="Informasi kesehatan otomatis">
          <div className="metric-card">
            <p className="metric-card__label">Kebutuhan Kalori</p>
            <p className="metric-card__value">{kalori}</p>
            <p className="metric-card__unit">kkal</p>
          </div>
          <div className="metric-card">
            <p className="metric-card__label">Kadar Gula Darah</p>
            <p className="metric-card__value">{gulaDarah}</p>
            <p className="metric-card__unit">mg/dL</p>
          </div>
          <div className="metric-card">
            <p className="metric-card__label">BMI / IMT</p>
            <p
              className={`metric-card__value ${
                bmi ? "" : "metric-card__value--hint"
              }`}
            >
              {bmi || incompleteProfileText}
            </p>
            <p className="metric-card__unit">{bmi ? "kg/m2" : "Profil"}</p>
          </div>
          <div className="metric-card">
            <p className="metric-card__label">BMR</p>
            <p
              className={`metric-card__value ${
                bmr ? "" : "metric-card__value--hint"
              }`}
            >
              {bmr || incompleteProfileText}
            </p>
            <p className="metric-card__unit">{bmr ? "kkal/hari" : "Profil"}</p>
          </div>
        </section>

        <section className="blood-sugar-chart-card" aria-label="Grafik gula darah">
          <div className="blood-sugar-chart-card__header">
            <div>
              <p className="blood-sugar-chart-card__title">Grafik Gula Darah</p>
              <p className="blood-sugar-chart-card__subtitle">
                Kadar Gula (mg/dL)
              </p>
            </div>
          </div>
          <div className="blood-sugar-chart-card__canvas">
            <Line data={gulaDarahChartData} options={gulaDarahChartOptions} />
          </div>
        </section>

        <section className="page-stack">
          <p className="section-title">Menu Utama</p>
          <div className="menu-grid">
            {menuItems.map((item) => (
              <div
                key={item.href}
                className={`menu-card menu-card--${item.color}`}
              >
                <Link href={item.href}>
                  <span className="menu-card__icon">
                    <FontAwesomeIcon icon={item.icon} />
                  </span>
                  <span className="menu-card__label">{item.label}</span>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </LayoutUser>
  );
}
