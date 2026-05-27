import LayoutAdmin from "../Layouts/Admin";

export default function Main() {
  return (
    <>
      <LayoutAdmin>
        <div className="page-stack">
          <section className="dashboard-hero">
            <p>Aplikasi Gizi Diabetes</p>
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </section>
        </div>
      </LayoutAdmin>
    </>
  );
}
