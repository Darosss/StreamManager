import { useMemo } from "react";

import { Link, LinkProps, useLocation } from "react-router-dom";
import DrawerBar from "@components/drawer";
import { routes } from "@routes";
import ChangeTheme from "@components/changeTheme";
import DiscordInviteButton from "./DiscordInviteButton";
import SignupButton from "@components/auth";

interface NavLinkProps extends LinkProps {
  label: string;
}

function resetWindowScroll() {
  window.scroll(0, 0);
}

export default function SideBar() {
  return (
    <DrawerBar direction={"right"} size={"15vw"} overlay={true}>
      <ul className="sidebar-ul">
        <li>
          <ChangeTheme />
        </li>
        {routes
          .map((r) => r.routes.map((r) => ({ ...r })))
          .flat()
          .map((route, index) => (
            <NavLink key={index} to={route.path} label={route.label} />
          ))}

        <li>
          <SignupButton />
        </li>
        <li>
          <DiscordInviteButton />
        </li>
      </ul>
    </DrawerBar>
  );
}

const NavLink = ({ label, ...restProps }: NavLinkProps) => {
  const location = useLocation();
  function handleClick() {
    resetWindowScroll();
  }

  const isUserOnThisSite = useMemo(() => {
    const restPropsToString = restProps.to.toString();
    return (
      restPropsToString.length > 1 &&
      location.pathname.includes(restPropsToString)
    );
  }, [restProps.to, location.pathname]);

  return (
    <li>
      <Link
        {...restProps}
        className={`common-button ${
          isUserOnThisSite ? "secondary-button" : "primary-button"
        }`}
        onClick={handleClick}
      >
        {label}
      </Link>
    </li>
  );
};
