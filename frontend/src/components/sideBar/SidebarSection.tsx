import { routes } from "@routes";
import NavLink from "./NavLink";
import { Button } from "@components/ui/button";
import React from "react";

type ContentType =
  | { route: (typeof routes)[number] }
  | {
      sectionName: string;
      children: React.ReactNode;
    };

const isRouteContent = (content: ContentType) => "route" in content;

interface SidebarSectionProps {
  content: ContentType;
  isOpen: boolean;
  isExpanded: boolean;
  onClickHeader: () => void;
}

export default function SidebarSection({
  content,
  isExpanded,
  isOpen,
  onClickHeader,
}: SidebarSectionProps) {
  const routeContent = isRouteContent(content);
  return (
    <div className="sidebar-section">
      <Button
        variant="secondary"
        size="small"
        onClick={onClickHeader}
        className="sidebar-section__button_header"
      >
        {!isOpen
          ? null
          : routeContent
            ? content.route.title
            : content.sectionName}
        {isExpanded ? "▲" : "▼"}
      </Button>
      <div>
        <ul className="sidebar-section__submenu-content">
          {!isExpanded
            ? null
            : routeContent
              ? content.route.routes.map((innerRoute) => (
                  <NavLink
                    to={innerRoute.path}
                    label={innerRoute.label}
                    icon={innerRoute.icon}
                    onlyIcon={!isOpen}
                  />
                ))
              : content.children}
        </ul>
      </div>
    </div>
  );
}
