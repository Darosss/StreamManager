import { Button } from "@components/ui/button";
import { useMemo } from "react";
import { Link, LinkProps, useLocation } from "react-router";
interface NavLinkProps extends LinkProps {
  label: string;
  icon: React.ReactNode;
  onlyIcon: boolean;
}

function resetWindowScroll() {
  window.scroll(0, 0);
}
export default function NavLink({
  label,
  icon,
  onlyIcon,
  ...restProps
}: NavLinkProps) {
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
    <li className="nav-link">
      <Button variant={isUserOnThisSite ? "secondary" : "primary"}>
        <Link {...restProps} onClick={handleClick}>
          <CommonSidebarChildren
            icon={icon}
            onlyIcon={onlyIcon}
            label={label}
          />
        </Link>
      </Button>
    </li>
  );
}
interface CommonSidebarChildrenProps {
  icon: React.ReactNode;
  label: string;
  onlyIcon: boolean;
}
function CommonSidebarChildren({
  icon,
  label,
  onlyIcon,
}: CommonSidebarChildrenProps) {
  return (
    <>
      <div> {icon} </div>
      {!onlyIcon && <div>{label}</div>}
    </>
  );
}
