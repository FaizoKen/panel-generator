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
import CheckBox from "./CheckBox";

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

  const setName = useCurrentMessageStore((state) => state.setModalName);

  const setPlaceholder = useCurrentMessageStore(
    (state) => state.setModaPlaceholder
  );

  const setValue = useCurrentMessageStore((state) => state.setModalValue);

  const setminLength = useCurrentMessageStore(
    (state) => state.setModalminLength
  );
  const setmaxLength = useCurrentMessageStore(
    (state) => state.setModalmaxLength
  );

  const [style, setStyle] = useCurrentMessageStore(
    (state) => [
      state.getModal(rowIndex, compIndex, modalIndex)?.style,
      state.setModaStyle,
    ],
    shallow
  );

  const [disabled, setRequired] = useCurrentMessageStore((state) => [
    state.getModal(rowIndex, compIndex, modalIndex)?.required,
    state.setModalRequired,
  ]);

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

  const inputType = style === 2 ? "textarea" : "text";

  return (
<div className="border border-dark-6 rounded-lg p-4 bg-dark-8 shadow-md">
  <Collapsable
    id={`components.${rowId}.select.${compId}.modals.${modalId}`}
    valiationPathPrefix={`components.${rowIndex}.components.${compIndex}.modals.${modalIndex}`}
    defaultCollapsed={true}
    title={`Form ${modalIndex + 1}`}
    extra={
      modal.name && (
        <div className="text-gray-500 truncate flex items-center space-x-2">
          <span>-</span>
          <span className="truncate">{modal.name}</span>
        </div>
      )
    }
    buttons={
      <div className="flex items-center space-x-3">
        {modalIndex > 0 && (
          <ChevronUpIcon
            className="h-6 w-6 text-gray-300 hover:text-blue-400 transition-colors cursor-pointer"
            role="button"
            onClick={() => moveUp(rowIndex, compIndex, modalIndex)}
          />
        )}
        {modalIndex < modalCount - 1 && (
          <ChevronDownIcon
            className="h-6 w-6 text-gray-300 hover:text-blue-400 transition-colors cursor-pointer"
            role="button"
            onClick={() => moveDown(rowIndex, compIndex, modalIndex)}
          />
        )}
        {modalCount < 25 && (
          <DocumentDuplicateIcon
            className="h-5 w-5 text-gray-300 hover:text-blue-400 transition-colors cursor-pointer"
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
        className="w-full"
        validationPath={`components.${rowIndex}.components.${compIndex}.modals.${modalIndex}.name`}
      />

      {/* Min Length and Max Length in one row */}
      <div className="flex space-x-4">
        <div className="w-1/2">
          <EditorInput
            label="Min Length"
            type="number"
            value={modal.minLength?.toString() || ""}
            onChange={(v) =>
              setminLength(rowIndex, compIndex, modalIndex, Number(v))
            }
            className="w-full"
            validationPath={`components.${rowIndex}.components.${compIndex}.modals.${modalIndex}.minLength`}
          />
        </div>
        <div className="w-1/2">
          <EditorInput
            label="Max Length"
            type="number"
            value={modal.maxLength?.toString() || ""}
            onChange={(v) =>
              setmaxLength(rowIndex, compIndex, modalIndex, Number(v))
            }
            className="w-full"
            validationPath={`components.${rowIndex}.components.${compIndex}.modals.${modalIndex}.maxLength`}
          />
        </div>
      </div>

      {/* Style & Required on the same row */}
      <div className="flex items-center space-x-4">
        <div className="w-full">
          <div className="uppercase text-gray-300 text-sm font-medium mb-1.5">
            Style
          </div>
          <select
            className="bg-dark-2 rounded p-2 w-full no-ring font-light cursor-pointer text-white"
            value={style?.toString()}
            onChange={(e) =>
              setStyle(rowIndex, compIndex, modalIndex, e.target.value)
            }
          >
            <option value="1">Short</option>
            <option value="2">Paragraph</option>
          </select>
        </div>
        <div>
          <div className="uppercase text-gray-300 text-sm font-medium mb-1.5">
            Required
          </div>
          <CheckBox
            checked={disabled ?? false}
            onChange={(v) => setRequired(rowIndex, compIndex, modalIndex, v)}
          />
        </div>
      </div>

      <EditorInput
        label="Placeholder"
        type={inputType}
        maxLength={80}
        value={modal.placeholder}
        onChange={(v) =>
          setPlaceholder(rowIndex, compIndex, modalIndex, v)
        }
        className="w-full"
        validationPath={`components.${rowIndex}.components.${compIndex}.modals.${modalIndex}.placeholder`}
      />

      <EditorInput
        label="Default Value"
        type={inputType}
        maxLength={80}
        value={modal.value}
        onChange={(v) => setValue(rowIndex, compIndex, modalIndex, v)}
        className="w-full"
        validationPath={`components.${rowIndex}.components.${compIndex}.modals.${modalIndex}.value`}
      />
    </div>
  </Collapsable>
</div>



  );
}