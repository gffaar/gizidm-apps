import { Link, usePage } from "@inertiajs/react";
import LayoutUser from "../../../Layouts/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { PolarAreaChart } from "../../../Components/Chart/PolarArea";

export default function UserRekamGiziShow() {
  const { rekamGizi } = usePage().props;
  const kaloriTotal = Number(rekamGizi?.kalori_total || 0);
  const formatNumber = (value) => {
    const rounded = Number(value || 0).toFixed(1);

    return rounded.endsWith(".0") ? parseInt(rounded) : rounded;
  };

  // Tambahan Serat dan Natrium
  const serat = kaloriTotal ? (kaloriTotal / 1000) * 14 : 0;
  const natrium = 1500;
  const chartNutrisi = [
    { label: "Karbohidrat", value: Number(rekamGizi.karbohidrat || 0) },
    { label: "Protein", value: Number(rekamGizi.protein || 0) },
    { label: "Lemak", value: Number(rekamGizi.lemak || 0) },
    { label: "Serat", value: Number(serat || 0) },
  ];
  const nutrisi = [
    {
      label: "Kebutuhan Kalori",
      value: kaloriTotal ? parseInt(kaloriTotal) : 0,
      unit: "kkal/hari",
    },
    {
      label: "Karbohidrat",
      value: formatNumber(rekamGizi.karbohidrat),
      unit: "g",
    },
    {
      label: "Protein",
      value: formatNumber(rekamGizi.protein),
      unit: "g",
    },
    {
      label: "Lemak",
      value: formatNumber(rekamGizi.lemak),
      unit: "g",
    },
    {
      label: "Serat",
      value: formatNumber(serat),
      unit: "g/hari",
    },
    {
      label: "Natrium",
      value: natrium,
      unit: "mg/hari",
      note: "Batasi konsumsi garam berlebih.",
    },
  ];
  const chartData = {
    labels: chartNutrisi.map((item) => item.label),
    datasets: [
      {
        label: "Kebutuhan Gizi",
        data: chartNutrisi.map((item) => item.value),
        backgroundColor: [
          "rgba(15, 118, 110, 0.72)",
          "rgba(21, 94, 117, 0.64)",
          "rgba(197, 138, 19, 0.68)",
          "rgba(22, 132, 87, 0.58)",
        ],
        borderColor: [
          "rgba(15, 118, 110, 1)",
          "rgba(21, 94, 117, 1)",
          "rgba(197, 138, 19, 1)",
          "rgba(22, 132, 87, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw} g`,
        },
      },
    },
    scales: {
      r: {
        ticks: {
          display: false,
        },
        grid: {
          color: "rgba(100, 116, 139, 0.16)",
        },
      },
    },
  };

  return (
    <LayoutUser>
      <div className="page-stack">
        <div className="page-header">
          <Link
            href={"/user/rekam-gizi/create"}
            className="back-link"
            aria-label="Kembali"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <div className="page-header__content">
            <p className="page-title">Hasil Perhitungan</p>
            <p className="page-subtitle">Ringkasan kebutuhan gizi harian</p>
          </div>
        </div>

        <section className="metric-grid">
          <div className="metric-card">
            <p className="metric-card__label">Kebutuhan Kalori Harian</p>
            <p className="metric-card__value">
              {kaloriTotal ? parseInt(kaloriTotal) : 0}
            </p>
            <p className="metric-card__unit">kkal/hari</p>
          </div>
          <div className="metric-card">
            <p className="metric-card__label">Indeks Massa Tubuh</p>
            <p className="metric-card__value">{rekamGizi.imt}</p>
            <p className="metric-card__unit">{rekamGizi.status_gizi}</p>
          </div>
        </section>

        <section className="card">
          <div className="card-body">
            <h2 className="card-title">Rincian Kebutuhan Gizi</h2>
            <div className="nutrition-chart">
              <PolarAreaChart data={chartData} options={chartOptions} />
            </div>
            <div className="grid gap-3">
              {/* Tambahan Serat dan Natrium */}
              {nutrisi.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between border-b border-base-300 pb-3 last:border-b-0 last:pb-0"
                >
                  <span>
                    {item.label}
                    {item.note && (
                      <small className="block text-slate-500">{item.note}</small>
                    )}
                  </span>
                  <span className="font-bold text-primary">
                    {item.value} {item.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Link href={"/"} className="btn btn-primary w-full">
          Simpan Hasil
        </Link>
      </div>
    </LayoutUser>
  );
}
