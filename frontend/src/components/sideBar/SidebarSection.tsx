import { routes } from "@routes";
import NavLink from "./NavLink";
import { Button } from "@components/ui/button";

interface SidebarSectionProps {
  route: (typeof routes)[number];
  isOpen: boolean;
  isExpanded: boolean;
  onClickHeader: () => void;
}

export default function SidebarSection({
  route,
  isExpanded,
  isOpen,
  onClickHeader,
}: SidebarSectionProps) {
  return (
    <div className="sidebar-section">
      <Button
        variant="secondary"
        size="small"
        onClick={onClickHeader}
        className="sidebar-section__button_header"
      >
        {isOpen && route.title}
        {isExpanded ? "▲" : "▼"}
      </Button>
      <div>
        <ul>
          {isExpanded &&
            route.routes.map((innerRoute) => (
              <NavLink
                to={innerRoute.path}
                label={innerRoute.label}
                icon={innerRoute.icon}
                onlyIcon={!isOpen}
              />
            ))}
        </ul>
      </div>
    </div>
  );
}
