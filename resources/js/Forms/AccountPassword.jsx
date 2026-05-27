import { useForm } from "@inertiajs/react";

export default function FormAccountPassword() {
  const { data, setData, put, processing, errors, progress } = useForm({
    old_password: "",
    password: "",
    password_confirmation: "",
  });

  function submit(e) {
    e.preventDefault();
    put("/account/password");
  }

  return (
    <form onSubmit={submit}>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Profil</legend>

        <label className="label">Password Lama</label>
        <input
          type="password"
          className="input"
          placeholder="Password Lama"
          value={data.old_password}
          onChange={(e) => setData("old_password", e.target.value)}
        />
        {errors.old_password && (
          <span className="text-error">{errors.old_password}</span>
        )}

        <label className="label">Password Baru</label>
        <input
          type="password"
          className="input"
          placeholder="Password Baru"
          value={data.password}
          onChange={(e) => setData("password", e.target.value)}
        />
        {errors.password && <span className="text-error">{errors.password}</span>}

        <label className="label">Password Baru Konfirmasi</label>
        <input
          type="password"
          className="input"
          placeholder="Password Baru Konfirmasi"
          value={data.password_confirmation}
          onChange={(e) => setData("password_confirmation", e.target.value)}
        />
        {errors.password_confirmation && <span className="text-error">{errors.password_confirmation}</span>}

        {progress && (
          <progress value={progress.percentage} max="100">
            {progress.percentage}%
          </progress>
        )}

        <button className="btn btn-primary w-full mt-4" disabled={processing}>
          Simpan
        </button>
      </fieldset>
    </form>
  );
}
