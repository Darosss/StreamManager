import { JSX } from "react";

interface ComponentWithTitleProps {
  title: string;
  component: JSX.Element;
}

type CustomTitleProps = Pick<ComponentWithTitleProps, "title">;

export default function ComponentWithTitle({
  title,
  component,
}: ComponentWithTitleProps) {
  return (
    <>
      <title>{title}</title>
      {component}
    </>
  );
}

export function CustomTitle({ title }: CustomTitleProps) {
  return <title>{title + " | Stream Manager"} </title>;
}
