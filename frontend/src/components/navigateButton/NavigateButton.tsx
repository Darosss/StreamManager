import { Link } from "react-router-dom";

export default function NavigateButton() {
  return (
    <div className="previous-page-wrapper">
      <Link className="common-button primary-button" to="/">
        &#8592;Home
      </Link>
    </div>
  );
}
