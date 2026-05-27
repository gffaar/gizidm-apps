import Swal from "sweetalert2";
import LayoutAdmin from "../../../../Layouts/Admin";
import { router, usePage } from "@inertiajs/react";
import { PolarAreaChart } from "../../../../Components/Chart/PolarArea";

export default function AdminPenggunaRekamGiziShow() {
  const { pengguna, rekamGizi } = usePage().props;

  const handleDelete = () => {
    Swal.fire({
      title: "Apakah Anda yakin ingin menghapus rekam gizi ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0f766e",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(
          `/admin/pengguna/${pengguna.id}/rekam-gizi/${rekamGizi.id}`,
        );
      }
    });
  };

  const chartData = {
    labels: ["Kalori", "Karbohidrat", "Protein", "Lemak", "IMT", "BMR", "TEE"],
    datasets: [
      {
        label: "Hasil Rekam Gizi",
        data: [
          rekamGizi.kalori_total,
          rekamGizi.karbohidrat,
          rekamGizi.protein,
          rekamGizi.lemak,
          rekamGizi.imt,
          rekamGizi.bmr,
          rekamGizi.tee,
        ],
        backgroundColor: [
          "rgba(15, 118, 110, 0.55)",
          "rgba(21, 94, 117, 0.55)",
          "rgba(197, 138, 19, 0.55)",
          "rgba(22, 132, 87, 0.55)",
          "rgba(2, 132, 199, 0.5)",
          "rgba(100, 116, 139, 0.5)",
          "rgba(220, 38, 38, 0.38)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <LayoutAdmin>
      <div className="page-stack">
        <div className="page-header">
          <div className="page-header__content">
            <p className="page-title">Rekam Gizi Pasien</p>
            <p className="page-subtitle">Hasil pengukuran {rekamGizi.tanggal}</p>
          </div>
        </div>

        <section className="metric-grid">
          <div className="metric-card">
            <p className="metric-card__label">Kalori Harian</p>
            <p className="metric-card__value">
              {parseInt(rekamGizi.kalori_total)}
            </p>
            <p className="metric-card__unit">kkal</p>
          </div>
          <div className="metric-card">
            <p className="metric-card__label">IMT</p>
            <p className="metric-card__value">{rekamGizi.imt}</p>
            <p className="metric-card__unit">{rekamGizi.status_gizi}</p>
          </div>
        </section>

        <section className="card">
          <div className="card-body">
            <h2 className="card-title">{rekamGizi.nama}</h2>
            <div className="grid gap-2">
              <p>Usia: {rekamGizi.usia} tahun</p>
              <p>Tinggi Badan: {rekamGizi.tinggi_badan} cm</p>
              <p>Berat Badan: {rekamGizi.berat_badan} kg</p>
              <p>Gula Darah Terakhir: {rekamGizi.kadar_gula_darah} mg/dL</p>
              <p>BMR: {rekamGizi.bmr}</p>
              <p>TEE: {rekamGizi.tee}</p>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-body">
            <h2 className="card-title">Distribusi Gizi</h2>
            <PolarAreaChart data={chartData} />
          </div>
        </section>

        <div className="flex justify-end">
          <button onClick={handleDelete} className="btn btn-error">
            Hapus
          </button>
        </div>
      </div>
    </LayoutAdmin>
  );
}
