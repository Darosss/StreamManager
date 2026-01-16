import { Error, Loading } from "@components/axiosHelper";
import CardboxWrapper from "@components/cardboxWrapper";
import Modal from "@components/modal";
import NavigateButton from "@components/navigateButton";
import {
  fetchAffixesDefaultParams,
  useGetAffixes,
  useCreateAffix,
  useEditAffix,
  Affix,
} from "@services";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "@hooks/useQueryParams";
import { closeModal, resetAffixState, setEditingId } from "@redux/affixesSlice";
import { RootStore } from "@redux/store";
import AffixModalData from "./AffixModalData";
import AffixesData from "./AffixesData";
import { NOTIFICATION_TYPE, useNotifications } from "@contexts";
import Filter from "@components/filter";
import { getPossibleCommonField, Options } from "@components/filter/Filter";

export default function Affixes() {
  const { addNotify } = useNotifications();
  const queryParams = useQueryParams(fetchAffixesDefaultParams);
  const { data: affixes, isLoading, error } = useGetAffixes(queryParams);
  const dispatch = useDispatch();
  const {
    isModalOpen,
    affix: affixState,
    editingId,
  } = useSelector((state: RootStore) => state.affixes);

  const createAffixMutation = useCreateAffix();
  const updateAffixMutation = useEditAffix();

  if (error) return <Error error={error} />;
  if (isLoading || !affixes) return <Loading />;

  const handleCreateAffix = () => {
    createAffixMutation.mutate(affixState);
    dispatch(resetAffixState());
  };

  const handleUpdateAffix = () => {
    if (!editingId) {
      addNotify({
        title: "Couldn't update affix",
        message: "No affix id",
        type: NOTIFICATION_TYPE.WARNING,
      });
      return;
    }
    updateAffixMutation.mutate({
      id: editingId,
      updatedAffix: affixState,
    });
    dispatch(resetAffixState());
    dispatch(setEditingId(""));
  };
  const filterOpts: Options<keyof Affix> = {
    ...getPossibleCommonField("search_name"),
  };
  return (
    <div>
      <div className="base-header-wrapper">
        <NavigateButton />
        <Filter options={filterOpts} />
      </div>
      <CardboxWrapper
        title={"Affixes list"}
        paginationProps={{
          localStorageName: "affixesListPageSize",
          currentPage: affixes.currentPage,
          totalCount: affixes.count,
          siblingCount: 1,
        }}
      >
        <AffixesData data={affixes.data} />
      </CardboxWrapper>

      <Modal
        title={`${editingId ? "Edit" : "Create"} affix`}
        onClose={() => dispatch(closeModal())}
        onSubmit={() => (editingId ? handleUpdateAffix() : handleCreateAffix())}
        show={isModalOpen}
      >
        <AffixModalData />
      </Modal>
    </div>
  );
}
