import { Button } from "@components/ui/button";
import { User, useGetUsers } from "@services";
import { useState } from "react";

interface SearchUsersProps {
  onClickUser: (user: User) => void;
  value?: User | null;
  currentUserId?: string;
}

export default function SearchUsers({
  value = null,
  onClickUser,
  currentUserId,
}: SearchUsersProps) {
  const [searchName, setSearchName] = useState("");
  const [whoAdded, setWhoAdded] = useState<User | null>(value);

  const { data } = useGetUsers({ search_name: searchName, limit: 5, page: 1 });

  return (
    <div className="search-users-wrapper">
      {whoAdded ? (
        <div className="who-added-wrapper">
          {whoAdded.username}
          <Button variant="danger" onClick={() => setWhoAdded(null)}>
            x
          </Button>
        </div>
      ) : (
        <div>Search users</div>
      )}
      {!whoAdded ? (
        <div className="search-user-content-wrapper">
          <div>
            <input
              type="text"
              onBlur={({ target: { value } }) => setSearchName(value)}
              onKeyDown={(e) =>
                e.key === "Enter" ? setSearchName(e.currentTarget.value) : null
              }
            />
          </div>
          <div> Users: </div>
          <div className="users-list">
            {data?.data?.map((user, index) => (
              <Button
                key={index}
                variant={currentUserId === user._id ? "primary" : "tertiary"}
                onClick={() => {
                  onClickUser(user);
                  setWhoAdded(user);
                }}
              >
                {user.username}
              </Button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
