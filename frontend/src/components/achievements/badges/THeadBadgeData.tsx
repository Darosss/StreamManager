import SortByParamsButton from "@components/SortByParamsButton";
import { Link } from "react-router";
import { useDispatch } from "react-redux";
import { openModal } from "@redux/badgesSlice";
import { Button } from "@components/ui/button";

export default function THeadBadgeData() {
  const dispatch = useDispatch();
  return (
    <tr>
      <th>
        Actions
        <Button onClick={() => dispatch(openModal())}>New</Button>
      </th>
      <th>
        <SortByParamsButton buttonText="Name" sortBy="name" />
      </th>
      <th>
        Image url
        <Link to="images" className="primary-button common-button">
          All images
        </Link>
      </th>
      <th>Description</th>
      <th className="badge-table-data">
        <SortByParamsButton buttonText="Created At" sortBy="createdAt" />
      </th>
      <th className="badge-table-data">
        <SortByParamsButton buttonText="Updated at" sortBy="updatedAt" />
      </th>
    </tr>
  );
}
