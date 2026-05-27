import {
  faBedPulse,
  faHouse,
  faNewspaper,
  faUser,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, usePage } from "@inertiajs/react";
import LayoutMain from "./Main";

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: faHouse,
    matches: ["/"],
  },
  {
    href: "/admin/pengguna",
    label: "Pasien",
    icon: faBedPulse,
    matches: ["/admin/pengguna"],
  },
  {
    href: "/admin/menu-makanan",
    label: "Makanan",
    icon: faUtensils,
    matches: ["/admin/menu-makanan"],
  },
  {
    href: "/admin/informasi",
    label: "Informasi",
    icon: faNewspaper,
    matches: ["/admin/informasi"],
  },
  {
    href: "/account",
    label: "Akun",
    icon: faUser,
    matches: ["/account"],
  },
];

function isActive(url, item) {
  if (item.href === "/") {
    return url === "/";
  }

  return item.matches.some((path) => url.startsWith(path));
}

export default function LayoutAdmin({ children }) {
  const { url } = usePage();

  return (
    <>
      <LayoutMain>
        <main className="app-shell">{children}</main>

        <nav className="bottom-nav" aria-label="Navigasi admin">
          <div className="bottom-nav__inner bottom-nav__inner--5">
            {navItems.map((item) => {
              const active = isActive(url, item);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`bottom-nav__item ${
                    active ? "bottom-nav__item--active" : ""
                  }`}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="bottom-nav__icon"
                  />
                  <span className="bottom-nav__label">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </LayoutMain>
    </>
  );
}
