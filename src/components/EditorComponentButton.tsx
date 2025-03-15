import {
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentDuplicateIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { useCurrentMessageStore } from "../state/message";
import Collapsable from "./Collapsable";
import { shallow } from "zustand/shallow";
import EditorInput from "./EditorInput";
import EditorComponentEmojiSelect from "./EditorComponentEmojiSelect";
import CheckBox from "./CheckBox";
import { AutoAnimate } from "../util/autoAnimate";
import EditorComponentButtonShowModal from "./EditorComponentButtonShowModal";
import { getUniqueId } from "../util";

interface Props {
  rowIndex: number;
  rowId: number;
  compIndex: number;
  compId: number;
}


const buttonBorderColors = {
  1: "border-blurple",
  2: "border-dark-7",
  3: "border-green",
  4: "border-red",
  5: "border-dark-7",
};

export default function EditorComponentButton({
  rowIndex,
  rowId,
  compIndex,
  compId,
}: Props) {
const buttons = useCurrentMessageStore(
  (state) => {
    const button = state.getButton(rowIndex, compIndex);
    if (!button || !("modals" in button)) return [];
    return button.modals.map((o) => o.id);
  },
  shallow
);
    const [add, clearModals] = useCurrentMessageStore(
      (state) => [state.addButtonModal, state.clearButtonModal],
      shallow
    );
  function addModal() {
    add(rowIndex, compIndex, {
      id: getUniqueId(),
      name: "",
      placeholder: "",
      value: "",
      style: 1,
    });
  }

  const buttonCount = useCurrentMessageStore(
    (state) => state.components[rowIndex].components.length
  );

  const [label, setLabel] = useCurrentMessageStore(
    (state) => [
      state.getButton(rowIndex, compIndex)?.label || "",
      state.setButtonLabel,
    ],
    shallow
  );

  const [emoji, setEmoji] = useCurrentMessageStore(
    (state) => [
      state.getButton(rowIndex, compIndex)?.emoji,
      state.setButtonEmoji,
    ],
    shallow
  );

  const [url, setUrl] = useCurrentMessageStore((state) => {
    const button = state.getButton(rowIndex, compIndex);
    return [button?.style === 5 ? button.url : "", state.setButtonUrl];
  }, shallow);

  const [style, setStyle] = useCurrentMessageStore(
    (state) => [
      state.getButton(rowIndex, compIndex)?.style,
      state.setButtonStyle,
    ],
    shallow
  );

  const [disabled, setDisabled] = useCurrentMessageStore((state) => [
    state.getButton(rowIndex, compIndex)?.hidden,
    state.setButtonDisabled,
  ]);

  const [moveUp, moveDown, duplicate, remove] = useCurrentMessageStore(
    (state) => [
      state.moveButtonUp,
      state.moveButtonDown,
      state.duplicateButton,
      state.deleteButton,
    ],
    shallow
  );

  if (!style) {
    // This is not a button (shouldn't happen)
    return <div></div>;
  }

  const borderColor = buttonBorderColors[style];

  return (
<div
  className={`bg-dark-3 px-3 md:px-4 py-3 mb-3 rounded-md shadow border-2 ${borderColor}`}
>
  <Collapsable
    id={`components.${rowId}.buttons.${compId}`}
    collapsable={compId === 10}
    valiationPathPrefix={`components.${rowIndex}.components.${compIndex}`}
    title={
      compId === 10
        ? "Tickets"
        : compId === 11
        ? "Server Rules"
        : compId === 12
        ? "Panel Settings"
        : `Button ${compIndex + 1}`
    }
    extra={
      compId === 10 &&
      label && (
        <div className="text-gray-500 truncate flex space-x-2 pl-2">
          <div>-</div>
          <div className="truncate">{label}</div>
        </div>
      )
    }
    
    buttons={
      <div className="flex-none text-gray-300 flex items-center space-x-2">
        <div className="uppercase text-gray-300 text-sm font-medium mb-1.5">
          Hidden
        </div>
        <CheckBox
          checked={disabled ?? false}
          onChange={(v) => setDisabled(rowIndex, compIndex, v)}
        />
      </div>
    }
  >
    {compId === 10 && (
      <div className="space-y-4">
        <div className="flex space-x-3">
          <div className="flex-auto">
            <div className="mb-1.5 flex">
              <div className="uppercase text-gray-300 text-sm font-medium">
                Style
              </div>
            </div>
            <select
              className="bg-dark-2 rounded p-2 w-full no-ring font-light cursor-pointer text-white"
              value={style.toString()}
              onChange={(v) =>
                setStyle(rowIndex, compIndex, parseInt(v.target.value) as any)
              }
            >
              <option value="1">Blurple</option>
              <option value="2">Grey</option>
              <option value="3">Green</option>
              <option value="4">Red</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-3">
          <EditorComponentEmojiSelect
            emoji={emoji ?? undefined}
            onChange={(v) => setEmoji(rowIndex, compIndex, v)}
          />
          <EditorInput
            label="Label"
            maxLength={80}
            value={label}
            onChange={(v) => setLabel(rowIndex, compIndex, v)}
            className="flex-auto"
            validationPath={`components.${rowIndex}.components.${compIndex}.label`}
          />
        </div>

        {compId === 10 ? (
          <Collapsable
            id={`components.${rowId}.select.${compId}.modals`}
            valiationPathPrefix={`components.${rowIndex}.components.${compIndex}.modals`}
            title="Show Forms"
          >
            <AutoAnimate className="space-y-2">
              {buttons.map((id, i) => (
                <div key={id}>
                  <EditorComponentButtonShowModal
                    rowIndex={rowIndex}
                    rowId={rowId}
                    compIndex={compIndex}
                    compId={compId}
                    modalIndex={i}
                    modalId={id}
                  />
                </div>
              ))}
            </AutoAnimate>
            <div className="space-x-3 mt-3">
              {buttons.length < 5 ? (
                <button
                  className="bg-blurple px-3 py-2 rounded transition-colors hover:bg-blurple-dark text-white"
                  onClick={addModal}
                >
                  Add Form
                </button>
              ) : (
                <button
                  disabled
                  className="bg-dark-2 px-3 py-2 rounded transition-colors cursor-not-allowed text-gray-300"
                >
                  Add Form
                </button>
              )}
              <button
                className="px-3 py-2 rounded border-2 border-red hover:bg-red transition-colors text-white"
                onClick={() => clearModals(rowIndex, compIndex)}
              >
                Clear Forms
              </button>
            </div>
          </Collapsable>
        ) : (
          style === 5 && (
            <EditorInput
              label="URL"
              type="url"
              value={url}
              onChange={(v) => setUrl(rowIndex, compIndex, v)}
              validationPath={`components.${rowIndex}.components.${compIndex}.url`}
            />
          )
        )}
      </div>
    )}
  </Collapsable>
</div>


  );
}
