import FormDaftar from "../Forms/Daftar";
import { Link } from "@inertiajs/react";

export default function Daftar() {
  return (
    <div className="app-auth">
      <div className="auth-card">
        <FormDaftar />
        <p className="auth-text text-center mt-4">
          Sudah punya akun?{" "}
          <Link className="auth-link" href="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
