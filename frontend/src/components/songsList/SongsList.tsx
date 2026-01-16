import { Loading, Error } from "@components/axiosHelper";
import Modal from "@components/modal";
import NavigateButton from "@components/navigateButton";
import {
  fetchSongsDefaultParams,
  useGetSongs,
  useCreateSong,
  useEditSong,
  Song,
} from "@services";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "@hooks/useQueryParams";
import { resetSongState, closeModal, setEditingId } from "@redux/songsSlice";
import { RootStore } from "@redux/store";
import SongModalData from "./SongModalData";
import SongsData from "./SongsData";
import { TableList } from "@components/tableWrapper";
import { NOTIFICATION_TYPE, useNotifications } from "@contexts";
import Filter from "@components/filter";
import { getPossibleCommonField, Options } from "@components/filter/Filter";

export default function SongsList() {
  const queryParams = useQueryParams(fetchSongsDefaultParams);
  const { addNotify } = useNotifications();
  const { data: songs, isLoading, error } = useGetSongs(queryParams);

  const dispatch = useDispatch();
  const { isModalOpen, song, editingId } = useSelector(
    (state: RootStore) => state.songs
  );

  const createSongMutation = useCreateSong();
  const updateSongMutation = useEditSong();

  if (error) return <Error error={error} />;
  if (isLoading || !songs) return <Loading />;

  const handleCreateSong = () => {
    createSongMutation.mutate(song);
    dispatch(resetSongState());
  };

  const handleUpdateSong = () => {
    if (!editingId) {
      addNotify({
        title: "Couldn't update song",
        message: "No song id",
        type: NOTIFICATION_TYPE.WARNING,
      });
      return;
    }
    updateSongMutation.mutate({
      id: editingId,
      updatedSong: song,
    });
    dispatch(resetSongState());
    dispatch(setEditingId(""));
  };
  const filterOpts: Options<keyof Song> = {
    ...getPossibleCommonField("search_name"),
    aliases: { type: "text", placeholder: "Aliases" },
    messages: { type: "text", placeholder: "Messages" },
    privilege: { type: "text", placeholder: "Privilege" },
  };
  return (
    <div>
      <div className="base-header-wrapper">
        <NavigateButton />
        <Filter options={filterOpts} />
      </div>
      <TableList
        paginationProps={{
          localStorageName: "songsListPageSize",
          currentPage: songs.currentPage,
          totalCount: songs.count,
          siblingCount: 1,
        }}
      >
        <SongsData data={songs.data} />
      </TableList>
      <Modal
        title={`${editingId ? "Edit" : "Create"} song`}
        onClose={() => dispatch(closeModal())}
        onSubmit={() => (editingId ? handleUpdateSong() : handleCreateSong())}
        show={isModalOpen}
      >
        <SongModalData />
      </Modal>
    </div>
  );
}
