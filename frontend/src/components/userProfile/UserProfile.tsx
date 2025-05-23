import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PreviousPage from "@components/previousPage";
import Message from "@components/message";
import { DateTooltip } from "@components/dateTooltip";
import { HelmetTitle } from "@components/componentWithTitle";
import { useEditUser, useGetLatestEldestMsgs, useGetUser } from "@services";
import { Error, Loading } from "@components/axiosHelper";

export default function UserProfile() {
  //Note: userId should be as it is taken from route
  const params = useParams();
  const userId = params.userId!;
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState("");

  const { data: userData, isLoading, error } = useGetUser(userId);

  const editUserMutation = useEditUser();

  const {
    data: msgsData,
    isLoading: msgLoading,
    error: msgsError,
  } = useGetLatestEldestMsgs(userId);

  const showEdit = () => {
    setIsEditingNotes((prevState) => {
      return !prevState;
    });
  };

  const handleSaveNote = () => {
    editUserMutation.mutate(
      { id: userId, updatedUser: { notes: notes.split("\n") } },
      { onSuccess: () => setIsEditingNotes(false) }
    );
  };

  useEffect(() => {
    setNotes(userData?.data.notes?.join("\n") || "");
  }, [userData]);

  if (error || msgsError) return <Error error={error || msgsError} />;
  if (!userData || !msgsData || msgLoading || isLoading) return <Loading />;
  const { data } = userData;
  return (
    <>
      <HelmetTitle title={data.username + " profile" || "User profile"} />
      <PreviousPage />
      <div className="profile-details-wrapper">
        <div className="detail-section-wrapper">
          <div>
            <div>Username:</div> <div>{data.username}</div>
            <div>Twitch name:</div>
            <div>{data.twitchName}</div>
          </div>
          <div>
            <div>First seen:</div>
            <div>
              <DateTooltip date={data.createdAt} />
            </div>
            <div>Twitch created:</div>
            <div>
              {data.twitchCreated ? (
                <DateTooltip date={data.twitchCreated} />
              ) : null}
            </div>
            <div>Last seen:</div>
            <div>
              {data.lastSeen ? <DateTooltip date={data.lastSeen} /> : null}
            </div>
          </div>
          <div>
            <div>Messages:</div>
            <div>{data.messageCount}</div>
            <div>Points:</div>
            <div>{data.points?.toFixed(0)}</div>
            <div>Follow:</div>
            <div>
              {data.follower ? <DateTooltip date={data.follower} /> : null}
            </div>
          </div>
        </div>

        <div className="detail-section-wrapper-big">
          <div>
            <div>
              <button
                onClick={showEdit}
                className="common-button primary-button profile-button"
              >
                Edit
              </button>
              {isEditingNotes ? (
                <button
                  className="common-button danger-button profile-button"
                  onClick={handleSaveNote}
                >
                  Save
                </button>
              ) : null}
            </div>
            <div>
              {isEditingNotes ? (
                <div>
                  <textarea
                    className="textarea-profile-edit"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              ) : (
                <ul>
                  {data.notes?.map((note, index) => {
                    return <li key={index}>{note}</li>;
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="detail-section-wrapper-big">
          <div>
            <div className="profile-messages">
              <div className="profile-messages-header"> First messages</div>
              {msgsData.data.firstMessages.map((msg) => {
                return (
                  <Message
                    key={msg._id}
                    date={msg.date}
                    username={msg.owner?.username || ""}
                    message={msg.message}
                  />
                );
              })}
            </div>
            <div className="profile-messages">
              <div className="profile-messages-header"> Latest messages</div>
              {msgsData.data.latestMessages.map((msg) => {
                return (
                  <Message
                    key={msg._id}
                    date={msg.date}
                    username={msg.owner?.username || ""}
                    message={msg.message}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="detail-section-wrapper-big">
          <div>
            <div>Graphs</div>
            <div>Graphs</div>
          </div>
        </div>
      </div>
    </>
  );
}
