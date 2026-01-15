import { Button } from "@components/ui";
import { Link } from "react-router";

export default function NavigateButton() {
  return (
    <div className="previous-page-wrapper">
      <Button size="small">
        <Link className="common-button primary-button" to="/">
          &#8592;Home
        </Link>
      </Button>
    </div>
  );
}
