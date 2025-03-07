import {
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentDuplicateIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import Collapsable from "./Collapsable";
import { shallow } from "zustand/shallow";
import { useCurrentMessageStore } from "../state/message";
import EditorInput from "./EditorInput";
import EditorComponentActions from "./EditorActionSet";
import EditorComponentEmojiSelect from "./EditorComponentEmojiSelect";
import ColorPicker from "./ColorPicker";
import ValidationError from "./ValidationError";
import { colorIntToHex } from "../util/discord";
import { useMemo } from "react";

interface Props {
  rowIndex: number;
  rowId: number;
  compIndex: number;
  compId: number;
  modalIndex: number;
  modalId: number;
}

export default function EditorComponentSelectMenuOption({
  rowIndex,
  rowId,
  compIndex,
  compId,
  modalIndex,
  modalId,
}: Props) {
    const modalCount = useCurrentMessageStore((state) => {
        const modalData = state.getButton(rowIndex, compIndex);
        if (!modalData || !("modals" in modalData)) return 0;
        return modalData.modals.length;
      });
      

  const [moveUp, moveDown, duplicate, remove] = useCurrentMessageStore(
    (state) => [
      state.moveButtonModalUp,
      state.moveButtonModalDown,
      state.duplicateButtonModal,
      state.deleteButtonModal,
    ],
    shallow
  );

  const setLabel = useCurrentMessageStore(
    (state) => state.setSelectMenuOptionLabel
  );

  const setName = useCurrentMessageStore(
    (state) => state.setModalName
  );

  const setDescription = useCurrentMessageStore(
    (state) => state.setSelectMenuOptionDescription
  );

  const setMsgDescription = useCurrentMessageStore(
    (state) => state.setSelectMenuOptionMsgDescription
  );

  const setMsgUrl = useCurrentMessageStore(
    (state) => state.setSelectMenuOptionMsgUrl
  );

  const setMsgColor = useCurrentMessageStore(
    (state) => state.setSelectMenuOptionMsgColor
  );

  const setMsgImageUrl = useCurrentMessageStore(
    (state) => state.setSelectMenuOptionMsgImageUrl
  );

  const setEmoji = useCurrentMessageStore(
    (state) => state.setSelectMenuOptionEmoji
  );

  const modal = useCurrentMessageStore(
    (state) => {
      const modalData = state.getButton(rowIndex, compIndex);
      if (!modalData || !("modals" in modalData)) return undefined;
      return modalData.modals[modalIndex];
    },
    shallow
  );
  
  if (!modal) {
    return <div></div>;
  }

  return (
    <div className="border-2 border-dark-6 rounded-md p-3">
      <Collapsable
        id={`components.${rowId}.select.${compId}.modals.${modalId}`}
        valiationPathPrefix={`components.${rowIndex}.components.${compIndex}.modals.${modalIndex}`}
        title={`Modal ${modalIndex + 1}`}
        extra={
          modal.name && (
            <div className="text-gray-500 truncate flex space-x-2 pl-2">
              <div>-</div>
              <div className="truncate">{modal.name}</div>
            </div>
          )
        }
        buttons={
          <div className="flex-none text-gray-300 flex items-center space-x-2">
            {modalIndex > 0 && (
              <ChevronUpIcon
                className="h-6 w-6 flex-none"
                role="button"
                onClick={() => moveUp(rowIndex, compIndex, modalIndex)}
              />
            )}
            {modalIndex < modalCount - 1 && (
              <ChevronDownIcon
                className="h-6 w-6 flex-none"
                role="button"
                onClick={() => moveDown(rowIndex, compIndex, modalIndex)}
              />
            )}
            {modalCount < 25 && (
              <DocumentDuplicateIcon
                className="h-5 w-5 flex-none"
                role="button"
                onClick={() => duplicate(rowIndex, compIndex, modalIndex)}
              />
            )}
            <TrashIcon
              className="h-5 w-5 flex-none"
              role="button"
              onClick={() => remove(rowIndex, compIndex, modalIndex)}
            />
          </div>
        }
      >
        <div className="space-y-4">
                        <EditorInput
                          label="Name"
                          maxLength={80}
                          value={modal.name}
                          onChange={(v) => setName(rowIndex, compIndex, modalIndex, v)}
                          className="flex-auto"
                          validationPath={`components.${rowIndex}.components.${compIndex}.modals.${modalIndex}.name`}
                        />
          <div className="flex space-x-3">
          </div>
        </div>
      </Collapsable>
    </div>
  );
}
