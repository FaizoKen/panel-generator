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
  optionIndex: number;
  optionId: number;
}

export default function EditorComponentSelectMenuOption({
  rowIndex,
  rowId,
  compIndex,
  compId,
  optionIndex,
  optionId,
}: Props) {
  const optionCount = useCurrentMessageStore(
    (state) => state.getSelectMenu(rowIndex, compIndex)?.options?.length || 0
  );

  const [moveUp, moveDown, duplicate, remove] = useCurrentMessageStore(
    (state) => [
      state.moveSelectMenuOptionUp,
      state.moveSelectMenuOptionDown,
      state.duplicateSelectMenuOption,
      state.deleteSelectMenuOption,
    ],
    shallow
  );

  const setLabel = useCurrentMessageStore(
    (state) => state.setSelectMenuOptionLabel
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

  const option = useCurrentMessageStore(
    (state) => state.getSelectMenu(rowIndex, compIndex)?.options?.[optionIndex],
    shallow
  );

    const color = option?.message_response.color;
  
    const hexColor = useMemo(
      () => (color !== undefined ? colorIntToHex(color) : "#1f2225"),
      [color]
    );

  if (!option) {
    return <div></div>;
  }

  return (
    <div className="bg-dark-3 p-3 rounded-md border-l-4"
    style={{ borderColor: hexColor }}>
      <Collapsable
        id={`components.${rowId}.select.${compId}.options.${optionId}`}
        valiationPathPrefix={`components.${rowIndex}.components.${compIndex}.options.${optionIndex}`}
        defaultCollapsed={true}
        title={`Option ${optionIndex + 1}`}
        extra={
          option.label && (
            <div className="text-gray-500 truncate flex space-x-2 pl-2">
              <div>-</div>
              <div className="truncate">{option.label}</div>
            </div>
          )
        }
        buttons={
          <div className="flex-none text-gray-300 flex items-center space-x-2">
            {optionIndex > 0 && (
              <ChevronUpIcon
                className="h-6 w-6 text-gray-300 hover:text-blue-400 transition-colors cursor-pointer"
                role="button"
                onClick={() => moveUp(rowIndex, compIndex, optionIndex)}
              />
            )}
            {optionIndex < optionCount - 1 && (
              <ChevronDownIcon
                className="h-6 w-6 text-gray-300 hover:text-blue-400 transition-colors cursor-pointer"
                role="button"
                onClick={() => moveDown(rowIndex, compIndex, optionIndex)}
              />
            )}
            {optionCount < 25 && (
              <DocumentDuplicateIcon
                className="h-5 w-5 text-gray-300 hover:text-blue-400 transition-colors cursor-pointer"
                role="button"
                onClick={() => duplicate(rowIndex, compIndex, optionIndex)}
              />
            )}
            <TrashIcon
              className="h-5 w-5 flex-none"
              role="button"
              onClick={() => remove(rowIndex, compIndex, optionIndex)}
            />
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex space-x-3">
            <EditorComponentEmojiSelect
              emoji={option.emoji ?? undefined}
              onChange={(v) => setEmoji(rowIndex, compIndex, optionIndex, v)}
            />
            <EditorInput
              label="Label & Title"
              maxLength={80}
              value={option.label}
              onChange={(v) => setLabel(rowIndex, compIndex, optionIndex, v)}
              className="flex-auto"
              validationPath={`components.${rowIndex}.components.${compIndex}.options.${optionIndex}.label`}
            />
          </div>
          <EditorInput
            label="Description & Footer"
            maxLength={100}
            value={option.description || ""}
            onChange={(v) =>
              setDescription(rowIndex, compIndex, optionIndex, v || undefined)
            }
            className="flex-auto"
            validationPath={`components.${rowIndex}.components.${compIndex}.options.${optionIndex}.description`}
          />
          <Collapsable
            id={`components.${rowId}.select.${compId}.options.${optionId}.message`}
            valiationPathPrefix={`components.${rowIndex}.components.${compIndex}.options.${optionIndex}.message_response`}
            title="Message Response"
          >
            <div className="space-y-4">
              <EditorInput
                type="textarea"
                label="Description"
                maxLength={4096}
                value={option.message_response.description || ""}
                onChange={(v) =>
                  setMsgDescription(
                    rowIndex,
                    compIndex,
                    optionIndex,
                    v || undefined
                  )
                }
                className="flex-auto"
                validationPath={`components.${rowIndex}.components.${compIndex}.options.${optionIndex}.message_response.description`}
                controls={true}
              />
              <div className="flex space-x-3">
                <EditorInput
                  type="url"
                  label="URL"
                  value={option.message_response.url || ""}
                  onChange={(v) =>
                    setMsgUrl(rowIndex, compIndex, optionIndex, v || undefined)
                  }
                  className="w-full"
                  validationPath={`components.${rowIndex}.components.${compIndex}.options.${optionIndex}.message_response.url`}
                />
                <div>
                  <div className="uppercase text-gray-300 text-sm font-medium mb-1.5">
                    Color
                  </div>
                  <ColorPicker
                    value={option.message_response.color}
                    onChange={(v) =>
                      setMsgColor(
                        rowIndex,
                        compIndex,
                        optionIndex,
                        v || undefined
                      )
                    }
                  />
                  <ValidationError path={`components.${rowIndex}.components.${compIndex}.options.${optionIndex}.message_response.color`} />
                </div>
              </div>
              <EditorInput
                type="url"
                label="Image URL"
                value={option.message_response.image_url || ""}
                imageUpload={true}
                onChange={(v) =>
                  setMsgImageUrl(
                    rowIndex,
                    compIndex,
                    optionIndex,
                    v || undefined
                  )
                }
                className="flex-auto"
                validationPath={`components.${rowIndex}.components.${compIndex}.options.${optionIndex}.message_response.image_url`}
              />
            </div>
          </Collapsable>
        </div>
      </Collapsable>
    </div>
  );
}
