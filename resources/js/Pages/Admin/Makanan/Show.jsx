import { Link, router, usePage } from "@inertiajs/react";
import LayoutAdmin from "../../../Layouts/Admin";
import Swal from "sweetalert2";

export default function AdminMakananShow() {
  const { makanan } = usePage().props;

  const handleDelete = () => {
    Swal.fire({
      title: "Apakah Anda yakin ingin menghapus makanan ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0f766e",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(`/admin/menu-makanan/${makanan.id}`);
      }
    });
  };

  const gambar = makanan.gambar ? `/storage/${makanan.gambar}` : `/no_image.jpg`;

  return (
    <LayoutAdmin>
      <div className="page-stack">
        <div className="page-header">
          <div className="page-header__content">
            <p className="page-title">Detail Makanan</p>
            <p className="page-subtitle">Informasi kandungan gizi menu</p>
          </div>
        </div>

        <div className="card">
          <figure>
            <img src={gambar} alt={makanan.nama} className="list-card-image" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{makanan.nama}</h2>
            <p>Kategori: {makanan.kategori}</p>
            <p>Kalori: {makanan.kalori} kkal</p>
            <p>Karbohidrat: {makanan.karbohidrat} g</p>
            <p>Protein: {makanan.protein} g</p>
            <p>Lemak: {makanan.lemak} g</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href={`/admin/menu-makanan/${makanan.id}/edit`}
            className="btn btn-primary"
          >
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-error">
            Hapus
          </button>
        </div>
      </div>
    </LayoutAdmin>
  );
}
