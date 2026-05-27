import { Link, router, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import LayoutAdmin from "../../../Layouts/Admin";
import Swal from "sweetalert2";

export default function AdminInformasiShow() {
  const { informasi } = usePage().props;
  const gambar = informasi.gambar ? `/storage/${informasi.gambar}` : "/no_image.jpg";

  const handleDelete = () => {
    Swal.fire({
      title: "Apakah Anda yakin ingin menghapus informasi ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(`/admin/informasi/${informasi.id}`);
      }
    });
  };

  return (
    <LayoutAdmin>
      <div className="page-stack">
        <div className="page-header">
          <Link href="/admin/informasi" className="back-link" aria-label="Kembali">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <div className="page-header__content">
            <p className="page-title">Detail Informasi</p>
            <p className="page-subtitle">Kelola artikel edukasi diabetes</p>
          </div>
        </div>

        <div className="card">
          <figure>
            <img src={gambar} alt={informasi.judul} className="list-card-image" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{informasi.judul}</h2>
            <p className="text-sm text-slate-500">
              {new Date(informasi.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="whitespace-pre-line leading-relaxed">{informasi.deskripsi}</p>
            <div className="card-actions justify-end">
              <Link href={`/admin/informasi/${informasi.id}/edit`} className="btn btn-primary">
                Edit
              </Link>
              <button onClick={handleDelete} className="btn btn-error">
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}
