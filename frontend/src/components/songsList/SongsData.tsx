import { useState } from "react";
import { DateTooltip } from "@components/dateTooltip";
import SortByParamsButton from "@components/SortByParamsButton";
import { TableListWrapper } from "@components/tableWrapper";
import { Song, useDeleteSong } from "@services";
import PreviewSongModal from "./PreviewSongModal";
import {
  openModal,
  resetSongState,
  setEditingId,
  setSongState,
} from "@redux/songsSlice";
import { useDispatch } from "react-redux";
import { HandleShowModalParams } from "@components/types";
import { Button } from "@components/ui/button";
import { StatusLabel } from "@components/common/StatusLabel";

interface SongsDataProps {
  data: Song[];
}

export default function SongsData({ data }: SongsDataProps) {
  const dispatch = useDispatch();
  const [previewedSong, setPrevievedSong] = useState<Song | null>(null);

  const deleteSongMutation = useDeleteSong();
  const handleDeleteSong = (id: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the song with ID: ${id}?`
      )
    )
      return;
    deleteSongMutation.mutate(id);
  };
  const handleShowModal = (params: HandleShowModalParams<Song>) => {
    dispatch(openModal());
    if (params?.type === "create") {
      dispatch(resetSongState());

      return;
    }
    const { type, data } = params;
    if (type === "edit") dispatch(setEditingId(data._id));
    dispatch(setSongState({ ...data, whoAdded: data.whoAdded._id }));
  };

  return (
    <>
      <TableListWrapper
        theadChildren={
          <tr>
            <th>
              Actions
              <Button
                className="common-button primary-button"
                onClick={() => handleShowModal({ type: "create" })}
              >
                New
              </Button>
            </th>
            <th>
              <SortByParamsButton buttonText="Title" sortBy="title" />
            </th>
            <th>
              <SortByParamsButton buttonText="Youtube Id" sortBy="youtubeId" />
              <SortByParamsButton buttonText="Suno Id" sortBy="sunoId" />
            </th>
            <th>Custom Id</th>
            <th>
              <SortByParamsButton buttonText="Uses" sortBy="uses" />
              <SortByParamsButton buttonText="botUses" sortBy="botUses" />

              <SortByParamsButton
                buttonText="SR Uses"
                sortBy="songRequestUses"
              />
            </th>
            <th>
              <SortByParamsButton buttonText="Enabled" sortBy="enabled" />
              <SortByParamsButton buttonText="Duration" sortBy="duration" />
            </th>
            <th>
              <SortByParamsButton buttonText="Last used" sortBy="lastUsed" />
            </th>
            <th>
              <SortByParamsButton buttonText="Created At" sortBy="createdAt" />
              <SortByParamsButton buttonText="Updated at" sortBy="updatedAt" />
            </th>
          </tr>
        }
        tbodyChildren={data.map((song, index) => {
          return (
            <tr
              key={index}
              className="songs-data-table-song-details"
              onClick={(e) => {
                setPrevievedSong(song);
              }}
            >
              <td>
                <div className="songs-data-table-actions">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowModal({ type: "edit", data: song });
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSong(song._id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </td>
              <td>{song.title}</td>
              <td>{song.youtubeId || song.sunoId || "Local"}</td>
              <td>{song.customId || ""}</td>
              <td>
                {song.uses} - {song.botUses} - {song.songRequestUses}
              </td>
              <td>
                <StatusLabel enabled={song.enabled}>
                  {song.enabled.toString()}
                </StatusLabel>
                ~~~~~~~~~
                <br />
                {song.duration}s
              </td>
              <td>
                {song.lastUsed ? <DateTooltip date={song.lastUsed} /> : null}
              </td>
              <td>
                <DateTooltip date={song.createdAt} /> ~~~~~~
                <DateTooltip date={song.updatedAt} />
              </td>
            </tr>
          );
        })}
      ></TableListWrapper>

      {previewedSong ? (
        <PreviewSongModal
          song={previewedSong}
          onCloseModal={() => setPrevievedSong(null)}
        />
      ) : null}
    </>
  );
}
