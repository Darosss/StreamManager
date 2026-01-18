import { useCallback, useEffect } from "react";

import { routes } from "@routes";
import ChangeTheme from "@components/changeTheme";
import DiscordInviteButton from "./DiscordInviteButton";
import SignupButton from "@components/auth";
import { useLocalStorage } from "@hooks";
import { Button } from "@components/ui/button";
import SidebarSection from "./SidebarSection";

type SidebarStatusLS = {
  isOpen: boolean;
  menus: Record<string, boolean>;
};

export default function SideBar() {
  const [sidebarStatus, setSidebarStatus] = useLocalStorage<SidebarStatusLS>(
    "sidebar-status",
    {
      isOpen: false,
      menus: {},
    },
  );

  const toggleIsOpen = () => {
    setSidebarStatus((prevState) => ({
      ...prevState,
      isOpen: !prevState.isOpen,
    }));
  };
  const handleHeaderClick = (name: string) => {
    console.log(name);
    setSidebarStatus((prevState) => ({
      ...prevState,
      menus: {
        ...prevState.menus,
        [name]: !prevState.menus[name],
      },
    }));
  };
  const handleMenuShortcuts = useCallback((ev: KeyboardEvent) => {
    if (ev.ctrlKey && ev.key === "b") {
      ev.preventDefault();
      toggleIsOpen();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleMenuShortcuts);
    return () => {
      window.removeEventListener("keydown", handleMenuShortcuts);
    };
  }, [handleMenuShortcuts]);
  return (
    <div className={`sidebar ${!sidebarStatus.isOpen ? "__hidden" : ""}`}>
      <ul className="sidebar__content">
        <li>
          <Button
            className="sidebar__toggle"
            variant="secondary"
            onClick={toggleIsOpen}
          >
            {sidebarStatus.isOpen ? "▶" : "◀"}
          </Button>
        </li>
        <li>
          <ChangeTheme />
        </li>
        {routes.map((route, index) => (
          <li key={index} className="sidebar__sub-sidebar">
            <SidebarSection
              route={route}
              onClickHeader={() => handleHeaderClick(route.title)}
              isExpanded={sidebarStatus.menus[route.title]}
              isOpen={sidebarStatus.isOpen}
            />
          </li>
        ))}

        <li>
          <SignupButton />
        </li>
        <li>
          <DiscordInviteButton />
        </li>
      </ul>
    </div>
  );
}
