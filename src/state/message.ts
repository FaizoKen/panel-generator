import { create, useStore } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  MessageComponentButtonStyle,
  EmbedField,
  Message,
  MessageComponentActionRow,
  buttonModal,
  MessageComponentButton,
  MessageEmbed,
  MessageComponentSelectMenuOption,
  MessageComponentSelectMenu,
  MessageAction,
  Emoji,
} from "../discord/schema";
import { getUniqueId } from "../util";
import { TemporalState, temporal } from "zundo";
import debounce from "just-debounce-it";
import { usePanelVarStore } from "./panelvar";
import { generateGuide } from "../util/guidegen";

const getAuthorData = () => {
  const author = usePanelVarStore.getState().loc;
  return author;
};

export interface MessageStore extends Message {
  clear(): void;
  replace(message: Message): void;
  setContent: (content: string) => void;
  setUsername: (username: string | undefined) => void;
  setAvatarUrl: (avatar_url: string | undefined) => void;
  setThreadName: (thread_name: string | undefined) => void;
  addEmbed: (embed: MessageEmbed) => void;
  clearEmbeds: () => void;
  moveEmbedDown: (i: number) => void;
  moveEmbedUp: (i: number) => void;
  duplicateEmbed: (i: number) => void;
  deleteEmbed: (i: number) => void;
  setEmbedDescription: (i: number, description: string | undefined) => void;
  setEmbedTitle: (i: number, title: string | undefined) => void;
  setEmbedUrl: (i: number, url: string | undefined) => void;
  setEmbedAuthorName: (i: number, name: string) => void;
  setEmbedAuthor: (i: number, use: boolean | undefined) => void;
  setEmbedGuide: (i: number, use: boolean | undefined) => void;
  setEmbedAuthorUrl: (i: number, url: string | undefined) => void;
  setEmbedAuthorIconUrl: (i: number, icon_url: string | undefined) => void;
  setEmbedThumbnailUrl: (i: number, url: string | undefined) => void;
  setEmbedImageUrl: (i: number, url: string | undefined) => void;
  setEmbedFooterText: (i: number, text: string | undefined) => void;
  setEmbedFooterIconUrl: (i: number, icon_url: string | undefined) => void;
  setEmbedColor: (i: number, color: number | undefined) => void;
  setEmbedTimestamp: (i: number, timestamp: string | undefined) => void;
  addEmbedField: (i: number, field: EmbedField) => void;
  setEmbedFieldName: (i: number, j: number, name: string) => void;
  setEmbedFieldValue: (i: number, j: number, value: string) => void;
  setEmbedFieldInline: (
    i: number,
    j: number,
    inline: boolean | undefined
  ) => void;
  moveEmbedFieldDown: (i: number, j: number) => void;
  moveEmbedFieldUp: (i: number, j: number) => void;
  deleteEmbedField: (i: number, j: number) => void;
  duplicateEmbedField: (i: number, j: number) => void;
  clearEmbedFields: (i: number) => void;
  addComponentRow: (row: MessageComponentActionRow) => void;
  clearComponentRows: () => void;
  moveComponentRowUp: (i: number) => void;
  moveComponentRowDown: (i: number) => void;
  duplicateComponentRow: (i: number) => void;
  deleteComponentRow: (i: number) => void;
  addButton: (i: number, button: MessageComponentButton) => void;
  clearButtons: (i: number) => void;
  moveButtonDown: (i: number, j: number) => void;
  moveButtonUp: (i: number, j: number) => void;
  duplicateButton: (i: number, j: number) => void;
  deleteButton: (i: number, j: number) => void;
  setButtonStyle: (
    i: number,
    j: number,
    style: MessageComponentButtonStyle
  ) => void;
  setButtonLabel: (i: number, j: number, label: string) => void;
  setButtonEmoji: (i: number, j: number, emoji: Emoji | undefined) => void;
  setButtonUrl: (i: number, j: number, url: string) => void;
  setButtonDisabled: (
    i: number,
    j: number,
    disabled: boolean | undefined
  ) => void;
  setModalRequired: (
    i: number,
    j: number,
    k: number,
    required: boolean | undefined
  ) => void;
  setSelectMenuPlaceholder: (
    i: number,
    j: number,
    placeholder: string | undefined
  ) => void;
  setSelectMenuDisabled: (
    i: number,
    j: number,
    disabled: boolean | undefined
  ) => void;
  addSelectMenuOption: (
    i: number,
    j: number,
    option: MessageComponentSelectMenuOption
  ) => void;
  addButtonModal: (
    i: number,
    j: number,
    modal: buttonModal
  ) => void;
  clearSelectMenuOptions: (i: number, j: number) => void;
  clearButtonModal: (i: number, j: number) => void;
  moveSelectMenuOptionDown: (i: number, j: number, k: number) => void;
  moveButtonModalDown: (i: number, j: number, k: number) => void;
  moveSelectMenuOptionUp: (i: number, j: number, k: number) => void;
  moveButtonModalUp: (i: number, j: number, k: number) => void;
  duplicateSelectMenuOption: (i: number, j: number, k: number) => void;
  duplicateButtonModal: (i: number, j: number, k: number) => void;
  deleteSelectMenuOption: (i: number, j: number, k: number) => void;
  deleteButtonModal: (i: number, j: number, k: number) => void;
  setSelectMenuOptionLabel: (
    i: number,
    j: number,
    k: number,
    label: string
  ) => void;
  setModalName: (
    i: number,
    j: number,
    k: number,
    name: string
  ) => void;
  setModaPlaceholder: (
    i: number,
    j: number,
    k: number,
    placeholder: string
  ) => void;
  setModalValue: (
    i: number,
    j: number,
    k: number,
    value: string
  ) => void;
  setModalminLength: (
    i: number,
    j: number,
    k: number,
    minLength: number
  ) => void;
  setModalmaxLength: (
    i: number,
    j: number,
    k: number,
    maxLength: number
  ) => void;
  setModaStyle: (
    i: number,
    j: number,
    k: number,
    style: string
  ) => void;
  setSelectMenuOptionDescription: (
    i: number,
    j: number,
    k: number,
    description: string | undefined
  ) => void;
  setSelectMenuOptionMsgDescription: (
    i: number,
    j: number,
    k: number,
    description: string | undefined
  ) => void;
  setSelectMenuOptionMsgUrl: (
    i: number,
    j: number,
    k: number,
    url: string | undefined
  ) => void;
  setSelectMenuOptionMsgColor: (
    i: number,
    j: number,
    k: number,
    color: number | undefined
  ) => void;
  setSelectMenuOptionMsgImageUrl: (
    i: number,
    j: number,
    k: number,
    description: string | undefined
  ) => void;
  setSelectMenuOptionEmoji: (
    i: number,
    j: number,
    k: number,
    emoji: Emoji | undefined
  ) => void;
  addAction: (id: string, action: MessageAction) => void;
  clearActions: (id: string) => void;
  deleteAction: (id: string, i: number) => void;
  moveActionUp: (id: string, i: number) => void;
  moveActionDown: (id: string, i: number) => void;
  duplicateAction: (id: string, i: number) => void;
  setActionType: (id: string, i: number, type: number) => void;
  setActionText: (id: string, i: number, text: string) => void;
  setActionTargetId: (id: string, i: number, target: string) => void;
  setActionPublic: (id: string, i: number, val: boolean) => void;
  setActionDisableDefaultResponse: (
    id: string,
    i: number,
    val: boolean
  ) => void;
  setActionPermissions: (id: string, i: number, val: string) => void;
  setActionRoleIds: (id: string, i: number, val: string[]) => void;

  getSelectMenu: (i: number, j: number) => MessageComponentSelectMenu | null;
  getButton: (i: number, j: number) => MessageComponentButton | null;
  getModal: (i: number, j: number, k: number) => buttonModal | null;
}

export const defaultMessage: Message = {
  "content": "",
  "tts": false,
  "embeds": [
    {
      "id": 1,
      "color": 5868222,
      "image": {
        "url": "https://i.imgur.com/jVtMuP1.png"
      },
      "fields": [],
      "hidden": false
    },
    {
      "id": 2,
      "color": 5868222,
      "fields": [],
      "hidden": false
    },
    {
      "id": 3,
      "color": 5868222,
      "fields": [],
      "hidden": false
    }
  ],
  "components": [
    {
      "id": 95670337,
      "type": 1,
      "components": [
        {
          "id": 639385666,
          "type": 3,
          "placeholder": "Frequently Asked Question (FAQ)",
          "disabled": false,
          "options": [
            {
              "id": 354268191,
              "label": "Discord – Community Guidelines",
              "description": "Discord",
              "message_response": {},
              "emoji": {
                "id": "1298193629625716776",
                "name": "discord",
                "animated": false
              },
              "action_set_id": "1"
            },
            {
              "id": 879145037,
              "label": "Discord – Privacy Policy",
              "description": "Discord",
              "message_response": {},
              "emoji": {
                "id": "1298193629625716776",
                "name": "discord",
                "animated": false
              },
              "action_set_id": "2"
            },
            {
              "id": 784367495,
              "label": "Discord – Terms of Service",
              "description": "Discord",
              "message_response": {},
              "emoji": {
                "id": "1298193629625716776",
                "name": "discord",
                "animated": false
              },
              "action_set_id": "3"
            }
          ]
        }
      ]
    },
    {
      "id": 473382410,
      "type": 1,
      "components": [
        {
          "id": 3403233,
          "type": 2,
          "style": 1,
          "label": "Contact Support",
          "emoji": {
            "id": "1281113840280539137",
            "name": "logo",
            "animated": false
          },
          "disabled": false,
          "action_set_id": "form",
          "modals": [
            {
              "id": 175283048,
              "name": "Test",
              "placeholder": "",
              "value": "",
              "style": 1
            }
          ]
        },
        {
          "id": 587113640,
          "type": 2,
          "style": 5,
          "label": "Server Rules",
          "emoji": {
            "name": "📋",
            "animated": false
          },
          "url": "https://discord.com",
          "disabled": false,
          "action_set_id": "rule"
        },
        {
          "id": 273509432,
          "type": 2,
          "style": 2,
          "label": "",
          "emoji": {
            "name": "⚙️",
            "animated": false
          },
          "disabled": false,
          "action_set_id": "setting",
          "modals": []
        }
      ]
    }
  ],
  "actions": {
    "1": {
      "actions": []
    },
    "2": {
      "actions": []
    },
    "3": {
      "actions": []
    },
    "form": {
      "actions": []
    },
    "rule": {
      "actions": []
    },
    "setting": {
      "actions": []
    }
  }
};

export const emptyMessage: Message = {
  content: "",
  tts: false,
  embeds: [],
  components: [],
  actions: {},
};

export const createMessageStore = (key: string) =>
  create<MessageStore>()(
    immer(
      persist(
        temporal(
          (set, get) => ({
            ...defaultMessage,

            clear: () => set(defaultMessage),
            replace: (message: Message) => set(message),
            setContent: (content: string) => set({ content }),
            setUsername: (username: string | undefined) => set({ username }),
            setAvatarUrl: (avatar_url: string | undefined) =>
              set({ avatar_url }),
            setThreadName: (thread_name: string | undefined) =>
              set({ thread_name }),
            addEmbed: (embed: MessageEmbed) =>
              set((state) => {
                if (!state.embeds) {
                  state.embeds = [embed];
                } else {
                  state.embeds.push(embed);
                }
              }),
            clearEmbeds: () => set({ embeds: [] }),
            moveEmbedDown: (i: number) => {
              set((state) => {
                if (!state.embeds) {
                  return;
                }
                const embed = state.embeds[i];
                if (!embed) {
                  return;
                }
                state.embeds.splice(i, 1);
                state.embeds.splice(i + 1, 0, embed);
              });
            },
            moveEmbedUp: (i: number) => {
              set((state) => {
                if (!state.embeds) {
                  return;
                }
                const embed = state.embeds[i];
                if (!embed) {
                  return;
                }
                state.embeds.splice(i, 1);
                state.embeds.splice(i - 1, 0, embed);
              });
            },
            duplicateEmbed: (i: number) => {
              set((state) => {
                if (!state.embeds) {
                  return;
                }
                const embed = state.embeds[i];
                if (!embed) {
                  return;
                }
                state.embeds.splice(i + 1, 0, { ...embed, id: getUniqueId() });
              });
            },
            deleteEmbed: (i: number) => {
              set((state) => {
                if (!state.embeds) {
                  return;
                }
                state.embeds.splice(i, 1);
              });
            },
            setEmbedDescription: (
              i: number,
              description: string | undefined
            ) => {
              set((state) => {
                if (state.embeds && state.embeds[i]) {
                  state.embeds[i].description = description;
                }
              });
            },
            setEmbedTitle: (i: number, title: string | undefined) => {
              set((state) => {
                if (state.embeds && state.embeds[i]) {
                  state.embeds[i].title = title;
                }
              });
            },
            setEmbedUrl: (i: number, url: string | undefined) => {
              set((state) => {
                if (state.embeds && state.embeds[i]) {
                  state.embeds[i].url = url;
                }
              });
            },
            setEmbedAuthorName: (i: number, name: string) =>
              set((state) => {
                const embed = state.embeds && state.embeds[i];
                if (!embed) {
                  return;
                }
                if (!name) {
                  if (!embed.author) {
                    return;
                  }

                  embed.author.name = name;
                  if (!embed.author.icon_url && !embed.author.url) {
                    embed.author = undefined;
                  }
                } else {
                  if (!embed.author) {
                    embed.author = { name };
                  } else {
                    embed.author.name = name;
                  }
                }
              }),
              setEmbedAuthor: (i: number, use: boolean | undefined) =>
                set((state) => {
                  const embed = state.embeds?.[i];
                  if (!embed) return;
              
                  if (use) {
                    const authorInfo = getAuthorData();
                    embed.author = {
                      name: authorInfo.guildName,
                      icon_url: authorInfo.guildIconUrl,
                    };
                  } else {
                    delete embed.author;
                  }
                }),
                setEmbedGuide: (i: number, use: boolean | undefined) =>
                  set((state) => {
                    const embed = state.embeds?.[i];
                    if (!embed) return;
                
                    if (use) {
                      const guideData = generateGuide(); // Get the generated guide
                
                      if (guideData.length > 0) {
                        const firstGuide = guideData[0]; // Use the first guide entry for title & color
                
                        embed.title = firstGuide.title;
                        embed.color = firstGuide.color;
                        embed.fields = guideData.flatMap((item) => item.fields || []);
                      }
                    } else {
                      // Remove properties from the embed
                      delete embed.title;
                      embed.fields = [];
                    }
                  }),
                
                
                
                
            setEmbedAuthorUrl: (i: number, url: string | undefined) =>
              set((state) => {
                const embed = state.embeds && state.embeds[i];
                if (!embed) {
                  return;
                }
                if (!url) {
                  if (!embed.author) {
                    return;
                  }
                  embed.author.url = undefined;

                  if (!embed.author.name && !embed.author.icon_url) {
                    embed.author = undefined;
                  }
                } else {
                  if (!embed.author) {
                    embed.author = { url, name: "" };
                  } else {
                    embed.author.url = url;
                  }
                }
              }),
            setEmbedAuthorIconUrl: (i: number, icon_url: string | undefined) =>
              set((state) => {
                const embed = state.embeds && state.embeds[i];
                if (!embed) {
                  return;
                }
                if (!icon_url) {
                  if (!embed.author) {
                    return;
                  }
                  embed.author.icon_url = undefined;

                  if (!embed.author.name && !embed.author.url) {
                    embed.author = undefined;
                  }
                } else {
                  if (!embed.author) {
                    embed.author = { icon_url, name: "" };
                  } else {
                    embed.author.icon_url = icon_url;
                  }
                }
              }),
            setEmbedThumbnailUrl: (i: number, url: string | undefined) => {
              set((state) => {
                if (state.embeds && state.embeds[i]) {
                  state.embeds[i].thumbnail = url ? { url } : undefined;
                }
              });
            },
            setEmbedImageUrl: (i: number, url: string | undefined) => {
              set((state) => {
                if (state.embeds && state.embeds[i]) {
                  state.embeds[i].image = url ? { url } : undefined;
                }
              });
            },
            setEmbedFooterText: (i: number, text: string | undefined) => {
              set((state) => {
                const embed = state.embeds && state.embeds[i];
                if (!embed) {
                  return;
                }
                if (!text) {
                  if (!embed.footer) {
                    return;
                  }
                  embed.footer.text = undefined;

                  if (!embed.footer.icon_url) {
                    embed.footer = undefined;
                  }
                } else {
                  if (!embed.footer) {
                    embed.footer = { text };
                  } else {
                    embed.footer.text = text;
                  }
                }
              });
            },
            setEmbedFooterIconUrl: (
              i: number,
              icon_url: string | undefined
            ) => {
              set((state) => {
                const embed = state.embeds && state.embeds[i];
                if (!embed) {
                  return;
                }
                if (!icon_url) {
                  if (!embed.footer) {
                    return;
                  }
                  embed.footer.icon_url = undefined;

                  if (!embed.footer.text) {
                    embed.footer = undefined;
                  }
                } else {
                  if (!embed.footer) {
                    embed.footer = { icon_url };
                  } else {
                    embed.footer.icon_url = icon_url;
                  }
                }
              });
            },
            setEmbedColor: (i: number, color: number | undefined) => {
              set((state) => {
                if (state.embeds) {
                  state.embeds.forEach((embed) => {
                    embed.color = color;
                  });
                }
              });
            },
            
            setEmbedTimestamp: (i: number, timestamp: string | undefined) => {
              set((state) => {
                if (state.embeds && state.embeds[i]) {
                  state.embeds[i].timestamp = timestamp;
                }
              });
            },
            addEmbedField: (i: number, field: EmbedField) =>
              set((state) => {
                const embed = state.embeds && state.embeds[i];
                if (!embed) {
                  return;
                }
                if (!embed.fields) {
                  embed.fields = [field];
                } else {
                  embed.fields.push(field);
                }
              }),
            setEmbedFieldName: (i: number, j: number, name: string) =>
              set((state) => {
                const embed = state.embeds && state.embeds[i];
                if (!embed) {
                  return;
                }
                const field = embed.fields && embed.fields[j];
                if (!field) {
                  return;
                }
                field.name = name;
              }),
            setEmbedFieldValue: (i: number, j: number, value: string) =>
              set((state) => {
                const embed = state.embeds && state.embeds[i];
                if (!embed) {
                  return;
                }
                const field = embed.fields && embed.fields[j];
                if (!field) {
                  return;
                }
                field.value = value;
              }),
            setEmbedFieldInline: (
              i: number,
              j: number,
              inline: boolean | undefined
            ) =>
              set((state) => {
                const embed = state.embeds && state.embeds[i];
                if (!embed) {
                  return;
                }
                const field = embed.fields && embed.fields[j];
                if (!field) {
                  return;
                }
                field.inline = inline;
              }),
            deleteEmbedField: (i: number, j: number) => {
              set((state) => {
                const embed = state.embeds && state.embeds[i];
                if (!embed) {
                  return;
                }
                embed.fields && embed.fields.splice(j, 1);
              });
            },
            moveEmbedFieldDown: (i: number, j: number) => {
              set((state) => {
                const embed = state.embeds && state.embeds[i];
                if (!embed) {
                  return;
                }
                const field = embed.fields && embed.fields[j];
                if (!field) {
                  return;
                }
                embed.fields && embed.fields.splice(j, 1);
                embed.fields && embed.fields.splice(j + 1, 0, field);
              });
            },
            moveEmbedFieldUp: (i: number, j: number) => {
              set((state) => {
                const embed = state.embeds && state.embeds[i];
                if (!embed) {
                  return;
                }
                const field = embed.fields && embed.fields[j];
                if (!field) {
                  return;
                }
                embed.fields && embed.fields.splice(j, 1);
                embed.fields && embed.fields.splice(j - 1, 0, field);
              });
            },
            duplicateEmbedField: (i: number, j: number) => {
              set((state) => {
                const embed = state.embeds && state.embeds[i];
                if (!embed) {
                  return;
                }
                const field = embed.fields && embed.fields[j];
                if (!field) {
                  return;
                }
                embed.fields &&
                  embed.fields.splice(j + 1, 0, {
                    ...field,
                    id: getUniqueId(),
                  });
              });
            },
            clearEmbedFields: (i: number) =>
              set((state) => {
                const embed = state.embeds && state.embeds[i];
                if (!embed) {
                  return;
                }
                embed.fields = [];
              }),
            addComponentRow: (row: MessageComponentActionRow) =>
              set((state) => {
                if (!state.components) {
                  state.components = [row];
                } else {
                  state.components.push(row);
                }
              }),
            clearComponentRows: () =>
              set((state) => {
                for (const row of state.components) {
                  for (const comp of row.components) {
                    if (comp.type === 2) {
                      delete state.actions[comp.action_set_id];
                    } else if (comp.type === 3) {
                      for (const option of comp.options) {
                        delete state.actions[option.action_set_id];
                      }
                    }
                  }
                }

                state.components = [];
              }),
            moveComponentRowUp: (i: number) =>
              set((state) => {
                const row = state.components && state.components[i];
                if (!row) {
                  return;
                }
                state.components.splice(i, 1);
                state.components.splice(i - 1, 0, row);
              }),
            moveComponentRowDown: (i: number) =>
              set((state) => {
                const row = state.components && state.components[i];
                if (!row) {
                  return;
                }
                state.components.splice(i, 1);
                state.components.splice(i + 1, 0, row);
              }),
            duplicateComponentRow: (i: number) =>
              set((state) => {
                const row = state.components && state.components[i];
                if (!row) {
                  return;
                }

                // This is a bit complex because we can't allow duplicated action set ids
                const newRow: MessageComponentActionRow = {
                  id: getUniqueId(),
                  type: 1,
                  components: row.components.map((comp) => {
                    if (comp.type === 2) {
                      const actionId = getUniqueId().toString();
                      state.actions[actionId] = { actions: [] };
                      return { ...comp, action_set_id: actionId };
                    } else {
                      return {
                        ...comp,
                        options: comp.options.map((option) => {
                          const actionId = getUniqueId().toString();
                          state.actions[actionId] = { actions: [] };
                          return {
                            ...option,
                            action_set_id: actionId,
                          };
                        }),
                      };
                    }
                  }),
                };

                // TODO: change action set ids
                state.components.splice(i + 1, 0, newRow);
              }),
            deleteComponentRow: (i: number) =>
              set((state) => {
                const removed = state.components.splice(i, 1);

                for (const row of removed) {
                  for (const comp of row.components) {
                    if (comp.type === 2) {
                      delete state.actions[comp.action_set_id];
                    } else if (comp.type === 3) {
                      for (const option of comp.options) {
                        delete state.actions[option.action_set_id];
                      }
                    }
                  }
                }
              }),
            addButton: (i: number, button: MessageComponentButton) =>
              set((state) => {
                const row = state.components && state.components[i];
                if (!row) {
                  return;
                }

                state.actions[button.action_set_id] = { actions: [] };

                if (!row.components) {
                  row.components = [button];
                } else {
                  row.components.push(button);
                }
              }),
            clearButtons: (i: number) =>
              set((state) => {
                const row = state.components && state.components[i];
                if (!row) {
                  return;
                }

                for (const button of row.components) {
                  if (button.type === 2) {
                    delete state.actions[button.action_set_id];
                  }
                }

                row.components = [];
              }),
            deleteButton: (i: number, j: number) =>
              set((state) => {
                const row = state.components[i];
                if (!row) {
                  return;
                }

                const removed = row.components.splice(j, 1);
                for (const button of removed) {
                  if (button.type === 2) {
                    delete state.actions[button.action_set_id];
                  }
                }
              }),
            moveButtonUp: (i: number, j: number) =>
              set((state) => {
                const row = state.components[i];
                if (!row) {
                  return;
                }
                const button = row.components[j];
                if (!button) {
                  return;
                }
                row.components.splice(j, 1);
                row.components.splice(j - 1, 0, button);
              }),
            moveButtonDown: (i: number, j: number) =>
              set((state) => {
                const row = state.components && state.components[i];
                if (!row) {
                  return;
                }
                const button = row.components[j];
                if (!button) {
                  return;
                }
                row.components.splice(j, 1);
                row.components.splice(j + 1, 0, button);
              }),
            duplicateButton: (i: number, j: number) =>
              set((state) => {
                const row = state.components && state.components[i];
                if (!row) {
                  return;
                }
                const button = row.components && row.components[j];
                if (!button || button.type !== 2) {
                  return;
                }

                const actionId = getUniqueId().toString();
                state.actions[actionId] = state.actions[button.action_set_id];

                row.components.splice(j + 1, 0, {
                  ...button,
                  id: getUniqueId(),
                  action_set_id: actionId,
                });
              }),
            setButtonStyle: (
              i: number,
              j: number,
              style: MessageComponentButtonStyle
            ) =>
              set((state) => {
                const row = state.components && state.components[i];
                if (!row) {
                  return;
                }
                const button = row.components && row.components[j];
                if (!button || button.type !== 2) {
                  return;
                }

                button.style = style;
                if (button.style === 5) {
                  button.url = "";
                  state.actions[button.action_set_id] = { actions: [] };
                }
              }),
            setButtonLabel: (i: number, j: number, label: string) =>
              set((state) => {
                const row = state.components && state.components[i];
                if (!row) {
                  return;
                }
                const button = row.components && row.components[j];
                if (!button || button.type !== 2) {
                  return;
                }
                button.label = label;
              }),
            setButtonEmoji: (i: number, j: number, emoji: Emoji | undefined) =>
              set((state) => {
                const row = state.components && state.components[i];
                if (!row) {
                  return;
                }
                const button = row.components && row.components[j];
                if (!button || button.type !== 2) {
                  return;
                }
                button.emoji = emoji;
              }),
            setButtonUrl: (i: number, j: number, url: string) =>
              set((state) => {
                const row = state.components && state.components[i];
                if (!row) {
                  return;
                }
                const button = row.components && row.components[j];
                if (!button || button.type !== 2 || button.style !== 5) {
                  return;
                }
                button.url = url;
              }),
            setButtonDisabled: (
              i: number,
              j: number,
              disabled: boolean | undefined
            ) =>
              set((state) => {
                const row = state.components && state.components[i];
                if (!row) {
                  return;
                }
                const button = row.components && row.components[j];
                if (!button) {
                  return;
                }
                button.disabled = disabled;
              }),
              setModalRequired: (
                i: number,
                j: number,
                k: number,
                required: boolean | undefined
              ) =>
                set((state) => {
                  const row = state.components && state.components[i];
                  if (!row) {
                    return;
                  }
                  const button = row.components && row.components[j];
                  if (!button || button.type == 3 || 'url' in button) {
                    return;
                    
                  }
                  const modals = button.modals && button.modals[k];
                  modals.required = required;
                }),
            setSelectMenuPlaceholder: (
              i: number,
              j: number,
              placeholder: string | undefined
            ) =>
              set((state) => {
                const row = state.components && state.components[i];
                if (!row) {
                  return;
                }
                const selectMenu = row.components && row.components[j];
                if (!selectMenu || selectMenu.type !== 3) {
                  return;
                }
                selectMenu.placeholder = placeholder;
              }),
            setSelectMenuDisabled: (
              i: number,
              j: number,
              disabled: boolean | undefined
            ) =>
              set((state) => {
                const row = state.components && state.components[i];
                if (!row) {
                  return;
                }
                const selectMenu = row.components && row.components[j];
                if (!selectMenu || selectMenu.type !== 3) {
                  return;
                }
                selectMenu.disabled = disabled;
              }),
            addSelectMenuOption: (
              i: number,
              j: number,
              option: MessageComponentSelectMenuOption
            ) =>
              set((state) => {
                const row = state.components && state.components[i];
                if (!row) {
                  return;
                }
                const selectMenu = row.components && row.components[j];
                if (!selectMenu || selectMenu.type !== 3) {
                  return;
                }

                state.actions[option.action_set_id] = { actions: [] };

                if (!selectMenu.options) {
                  selectMenu.options = [option];
                } else {
                  selectMenu.options.push(option);
                }
              }),
              addButtonModal: (
                i: number,
                j: number,
                modal: buttonModal
              ) =>
                set((state) => {
                  const row = state.components && state.components[i];
                  if (!row) {
                    return;
                  }
                  const button = row.components && row.components[j];
                  if (!button || button.type == 3 || 'url' in button) {
                    return;
                  }
  
                    if (!button.modals) {
                        button.modals = [modal];
                    } else {
                        button.modals.push(modal);
                    }
                               
                }),
            clearSelectMenuOptions: (i: number, j: number) =>
              set((state) => {
                const row = state.components && state.components[i];
                if (!row) {
                  return;
                }
                const selectMenu = row.components && row.components[j];
                if (!selectMenu || selectMenu.type !== 3) {
                  return;
                }

                for (const option of selectMenu.options) {
                  delete state.actions[option.action_set_id];
                }

                selectMenu.options = [];
              }),
              clearButtonModal: (i: number, j: number) =>
                set((state) => {
                  const row = state.components && state.components[i];
                  if (!row) {
                    return;
                  }
                  const button = row.components && row.components[j];
                  if (!button || button.type == 3 || 'url' in button) {
                    return;
                  }

                  button.modals = [];
                  
                }),
                
            moveSelectMenuOptionDown: (i: number, j: number, k: number) =>
              set((state) => {
                const row = state.components && state.components[i];
                if (!row) {
                  return;
                }
                const selectMenu = row.components && row.components[j];
                if (!selectMenu || selectMenu.type !== 3) {
                  return;
                }
                const option = selectMenu.options[k];
                if (!option) {
                  return;
                }
                selectMenu.options.splice(k, 1);
                selectMenu.options.splice(k + 1, 0, option);
              }),
              moveButtonModalDown: (i: number, j: number, k: number) =>
                set((state) => {
                  const row = state.components && state.components[i];
                  if (!row) {
                    return;
                  }
                  const button = row.components && row.components[j];
                  if (!button || button.type == 3 || 'url' in button) {
                    return;
                  }
                  const modal = button.modals[k];
                  if (!modal) {
                    return;
                  }
                  button.modals.splice(k, 1);
                  button.modals.splice(k + 1, 0, modal);
                }),
            moveSelectMenuOptionUp: (i: number, j: number, k: number) =>
              set((state) => {
                const row = state.components && state.components[i];
                if (!row) {
                  return;
                }
                const selectMenu = row.components && row.components[j];
                if (!selectMenu || selectMenu.type !== 3) {
                  return;
                }
                const option = selectMenu.options[k];
                if (!option) {
                  return;
                }
                selectMenu.options.splice(k, 1);
                selectMenu.options.splice(k - 1, 0, option);
              }),
              moveButtonModalUp: (i: number, j: number, k: number) =>
                set((state) => {
                  const row = state.components && state.components[i];
                  if (!row) {
                    return;
                  }
                  const button = row.components && row.components[j];
                  if (!button || button.type == 3 || 'url' in button) {
                    return;
                  }
                  const modal = button.modals[k];
                  if (!modal) {
                    return;
                  }
                  button.modals.splice(k, 1);
                  button.modals.splice(k - 1, 0, modal);
                }),
            duplicateSelectMenuOption: (i: number, j: number, k: number) =>
              set((state) => {
                const row = state.components && state.components[i];
                if (!row) {
                  return;
                }
                const selectMenu = row.components && row.components[j];
                if (!selectMenu || selectMenu.type !== 3) {
                  return;
                }
                const option = selectMenu.options[k];
                if (!option) {
                  return;
                }

                const actionId = getUniqueId().toString();
                state.actions[actionId] = state.actions[option.action_set_id];

                selectMenu.options.splice(k + 1, 0, {
                  ...option,
                  id: getUniqueId(),
                  action_set_id: actionId,
                });
              }),
              duplicateButtonModal: (i: number, j: number, k: number) =>
                set((state) => {
                  const row = state.components?.[i];
                  const button = row?.components?.[j];
              
                  if (!button || button.type === 3 || 'url' in button) return;
              
                  const modal = button.modals?.[k];
                  if (!modal) return;
              
                  button.modals.splice(k + 1, 0, { ...modal, id: getUniqueId() });
                }),              
            deleteSelectMenuOption: (i: number, j: number, k: number) =>
              set((state) => {
                const row = state.components && state.components[i];
                if (!row) {
                  return;
                }
                const selectMenu = row.components && row.components[j];
                if (!selectMenu || selectMenu.type !== 3) {
                  return;
                }

                const removed = selectMenu.options.splice(k, 1);
                for (const option of removed) {
                  delete state.actions[option.action_set_id];
                }
              }),
              deleteButtonModal: (i: number, j: number, k: number) =>
                set((state) => {
                  const row = state.components && state.components[i];
                  if (!row) {
                    return;
                  }
                  const button = row.components && row.components[j];
                  if (!button || button.type == 3 || 'url' in button) {
                    return;
                  }
                  button.modals.splice(k, 1);
                  // for (const option of removed) {
                  //   delete state.actions[modals.action_set_id];
                  // }
                }),
            setSelectMenuOptionLabel: (
              i: number,
              j: number,
              k: number,
              label: string
            ) =>
              set((state) => {
                const row = state.components && state.components[i];
                if (!row) {
                  return;
                }
                const selectMenu = row.components && row.components[j];
                if (!selectMenu || selectMenu.type !== 3) {
                  return;
                }
                const option = selectMenu.options && selectMenu.options[k];
                if (!option) {
                  return;
                }
                option.label = label;
              }),
              setModalName: (
                i: number,
                j: number,
                k: number,
                name: string
              ) =>
                set((state) => {
                  const row = state.components && state.components[i];
                  if (!row) {
                    return;
                  }
                  const button = row.components && row.components[j];
                  if (!button || button.type == 3 || 'url' in button) {
                    return;
                  }
                  const modal = button.modals && button.modals[k];
                  modal.name = name;
                }      
                ),
                setModaPlaceholder: (
                  i: number,
                  j: number,
                  k: number,
                  placeholder: string
                ) =>
                  set((state) => {
                    const row = state.components && state.components[i];
                    if (!row) {
                      return;
                    }
                    const button = row.components && row.components[j];
                    if (!button || button.type == 3 || 'url' in button) {
                      return;
                    }
                    const modal = button.modals && button.modals[k];
                    modal.placeholder = placeholder;
                  }      
                  ),
                  setModalValue: (
                    i: number,
                    j: number,
                    k: number,
                    value: string
                  ) =>
                    set((state) => {
                      const row = state.components && state.components[i];
                      if (!row) {
                        return;
                      }
                      const button = row.components && row.components[j];
                      if (!button || button.type == 3 || 'url' in button) {
                        return;
                      }
                      const modal = button.modals && button.modals[k];
                      modal.value = value;
                    }      
                    ),
                    setModalminLength: (
                      i: number,
                      j: number,
                      k: number,
                      minLength: number
                    ) =>
                      set((state) => {
                        const row = state.components && state.components[i];
                        if (!row) return;
                        const button = row.components && row.components[j];
                        if (!button || button.type === 3 || 'url' in button) return;
                        const modal = button.modals && button.modals[k];
                        if (!modal) return;
                        const clampedMin = Math.min(Math.max(minLength, 0), 1000);
                        if (clampedMin === 0) {
                          delete modal.minLength;
                        } else {
                          modal.minLength = clampedMin;
                          if (modal.maxLength !== undefined && modal.maxLength < clampedMin) {
                            modal.maxLength = clampedMin;
                          }
                        }
                      }),
                    
                    setModalmaxLength: (
                      i: number,
                      j: number,
                      k: number,
                      maxLength: number
                    ) =>
                      set((state) => {
                        const row = state.components && state.components[i];
                        if (!row) return;
                        const button = row.components && row.components[j];
                        if (!button || button.type === 3 || 'url' in button) return;
                        const modal = button.modals && button.modals[k];
                        if (!modal) return;
                        const clampedMax = Math.min(Math.max(maxLength,0), 1000);
                        if (clampedMax === 0) {
                          delete modal.maxLength;
                        } else {
                          modal.maxLength = clampedMax;
                          if (modal.minLength !== undefined && modal.minLength > clampedMax) {
                            modal.minLength = clampedMax;
                          }
                        }
                      }),
                                                        
                  setModaStyle: (
                    i: number,
                    j: number,
                    k: number,
                    style: string
                  ) =>
                    set((state) => {
                      const row = state.components && state.components[i];
                      if (!row) {
                        return;
                      }
                      const button = row.components && row.components[j];
                      if (!button || button.type == 3 || 'url' in button) {
                        return;
                      }
                      const modal = button.modals && button.modals[k];
                      const parsedStyle = Number(style);
                      if (parsedStyle === 1 || parsedStyle === 2) {
                        modal.style = parsedStyle;
                      }
                    }      
                    ),
            setSelectMenuOptionDescription: (
              i: number,
              j: number,
              k: number,
              description: string | undefined
            ) =>
              set((state) => {
                const row = state.components && state.components[i];
                if (!row) {
                  return;
                }
                const selectMenu = row.components && row.components[j];
                if (!selectMenu || selectMenu.type !== 3) {
                  return;
                }
                const option = selectMenu.options && selectMenu.options[k];
                if (!option) {
                  return;
                }
                option.description = description;
              }),
              setSelectMenuOptionMsgDescription: (
                i: number,
                j: number,
                k: number,
                description: string | undefined
              ) =>
                set((state) => {
                  const row = state.components && state.components[i];
                  if (!row) {
                    return;
                  }
                  const selectMenu = row.components && row.components[j];
                  if (!selectMenu || selectMenu.type !== 3) {
                    return;
                  }
                  const option = selectMenu.options && selectMenu.options[k];
                  if (!option) {
                    return;
                  }
                  option.message_response.description = description;
                }),
                setSelectMenuOptionMsgUrl: (                    
                  i: number,
                  j: number,
                  k: number,
                  url: string | undefined) =>
                  set((state) => {
                    const row = state.components && state.components[i];
                    if (!row) {
                      return;
                    }
                    const selectMenu = row.components && row.components[j];
                    if (!selectMenu || selectMenu.type !== 3) {
                      return;
                    }
                    const option = selectMenu.options && selectMenu.options[k];
                    if (!option) {
                      return;
                    }
                    option.message_response.url = url;
                  }),
                  setSelectMenuOptionMsgColor: (                    
                    i: number,
                    j: number,
                    k: number,
                    color: number | undefined) =>
                    set((state) => {
                      const row = state.components && state.components[i];
                      if (!row) {
                        return;
                      }
                      const selectMenu = row.components && row.components[j];
                      if (!selectMenu || selectMenu.type !== 3) {
                        return;
                      }
                      const option = selectMenu.options && selectMenu.options[k];
                      if (!option) {
                        return;
                      }
                      option.message_response.color = color;
                    }),
                  setSelectMenuOptionMsgImageUrl: (
                    i: number,
                    j: number,
                    k: number,
                    description: string | undefined
                  ) =>
                    set((state) => {
                      const row = state.components && state.components[i];
                      if (!row) {
                        return;
                      }
                      const selectMenu = row.components && row.components[j];
                      if (!selectMenu || selectMenu.type !== 3) {
                        return;
                      }
                      const option = selectMenu.options && selectMenu.options[k];
                      if (!option) {
                        return;
                      }
                      option.message_response.image_url = description;
                    }),
            setSelectMenuOptionEmoji: (
              i: number,
              j: number,
              k: number,
              emoji: Emoji | undefined
            ) =>
              set((state) => {
                const row = state.components && state.components[i];
                if (!row) {
                  return;
                }
                const selectMenu = row.components && row.components[j];
                if (!selectMenu || selectMenu.type !== 3) {
                  return;
                }
                const option = selectMenu.options && selectMenu.options[k];
                if (!option) {
                  return;
                }
                option.emoji = emoji;
              }),
            addAction: (id: string, action: MessageAction) =>
              set((state) => {
                const actionSet = state.actions[id];
                if (actionSet) {
                  actionSet.actions.push(action);
                } else {
                  state.actions[id] = { actions: [action] };
                }
              }),
            clearActions: (id: string) =>
              set((state) => {
                const actionSet = state.actions[id];
                if (actionSet) {
                  actionSet.actions = [];
                }
              }),
            deleteAction: (id: string, i: number) =>
              set((state) => {
                const actionSet = state.actions[id];
                if (actionSet) {
                  actionSet.actions.splice(i, 1);
                }
              }),
            moveActionUp: (id: string, i: number) =>
              set((state) => {
                const actionSet = state.actions[id];
                if (actionSet) {
                  const action = actionSet.actions[i];
                  if (action) {
                    actionSet.actions.splice(i, 1);
                    actionSet.actions.splice(i - 1, 0, action);
                  }
                }
              }),
            moveActionDown: (id: string, i: number) => {
              set((state) => {
                const actionSet = state.actions[id];
                if (actionSet) {
                  const action = actionSet.actions[i];
                  if (action) {
                    actionSet.actions.splice(i, 1);
                    actionSet.actions.splice(i + 1, 0, action);
                  }
                }
              });
            },
            duplicateAction: (id: string, i: number) => {
              set((state) => {
                const actionSet = state.actions[id];
                if (actionSet) {
                  const action = actionSet.actions[i];
                  if (action) {
                    actionSet.actions.splice(i + 1, 0, {
                      ...action,
                      id: getUniqueId(),
                    });
                  }
                }
              });
            },
            setActionType: (id: string, i: number, type: number) =>
              set((state) => {
                const actionSet = state.actions[id];
                const action = actionSet.actions[i];

                if (type === 1 || type === 6 || type === 8) {
                  actionSet.actions[i] = {
                    type,
                    id: action.id,
                    text: "",
                    public: false,
                  };
                } else if (type === 5 || type === 7 || type === 9) {
                  actionSet.actions[i] = {
                    type,
                    id: action.id,
                    target_id: "",
                    public: false,
                  };
                } else if (type === 2 || type === 3 || type === 4) {
                  actionSet.actions[i] = {
                    type,
                    id: action.id,
                    target_id: "",
                    public: false,
                    disable_default_response: false,
                  };
                } else if (type === 10) {
                  actionSet.actions[i] = {
                    type,
                    id: action.id,
                    permissions: "0",
                    role_ids: [],
                    disable_default_response: false,
                  };
                }
              }),
            setActionText: (id: string, i: number, text: string) =>
              set((state) => {
                const actionSet = state.actions[id];
                const action = actionSet.actions[i];
                if (
                  action.type === 1 ||
                  action.type === 6 ||
                  action.type === 8
                ) {
                  action.text = text;
                } else if (
                  action.type === 10 &&
                  action.disable_default_response
                ) {
                  action.text = text;
                }
              }),
            setActionTargetId: (id: string, i: number, target: string) =>
              set((state) => {
                const actionSet = state.actions[id];
                const action = actionSet.actions[i];
                if (
                  action.type === 2 ||
                  action.type === 3 ||
                  action.type === 4 ||
                  action.type === 5 ||
                  action.type === 7 ||
                  action.type === 9
                ) {
                  action.target_id = target;
                }
              }),
            setActionPublic: (id: string, i: number, val: boolean) =>
              set((state) => {
                const actionSet = state.actions[id];
                const action = actionSet.actions[i];
                if (action.type !== 10) {
                  action.public = val;
                }
              }),
            setActionDisableDefaultResponse: (
              id: string,
              i: number,
              val: boolean
            ) =>
              set((state) => {
                const actionSet = state.actions[id];
                const action = actionSet.actions[i];
                if (
                  action.type === 2 ||
                  action.type === 3 ||
                  action.type === 4 ||
                  action.type === 10
                ) {
                  action.disable_default_response = val;
                }
              }),
            setActionPermissions: (id: string, i: number, val: string) =>
              set((state) => {
                const actionSet = state.actions[id];
                const action = actionSet.actions[i];
                if (action.type === 10) {
                  action.permissions = val;
                }
              }),
            setActionRoleIds: (id: string, i: number, val: string[]) =>
              set((state) => {
                const actionSet = state.actions[id];
                const action = actionSet.actions[i];
                if (action.type === 10) {
                  action.role_ids = val;
                }
              }),

            getSelectMenu: (i: number, j: number) => {
              const state = get();
              const row = state.components && state.components[i];
              if (!row) {
                return null;
              }

              const selectMenu = row.components && row.components[j];
              if (selectMenu && selectMenu.type === 3) {
                return selectMenu;
              }
              return null;
            },
            getButton: (i: number, j: number) => {
              const state = get();
              const row = state.components && state.components[i];
              if (!row) {
                return null;
              }

              const button = row.components && row.components[j];
              if (button && button.type === 2) {
                return button;
              }
              return null;
            },
            getModal: (i: number, j: number, k: number) => {
              const state = get();
              const row = state.components && state.components[i];
              if (!row) {
                return null;
              }

              const button = row.components && row.components[j];
              if (!button || button.type == 3 || 'url' in button) {
                return null;
                
              }
              const modals = button.modals && button.modals[k];
              return modals;
            },
          }),
          {
            limit: 10,
            handleSet: (handleSet) => debounce(handleSet, 1000, true),
          }
        ),
        { name: key, version: 0 }
      )
    )
  );

export const useCurrentMessageStore = createMessageStore("current-message");

export const useCurrentMessageUndoStore = <T>(
  selector: (state: TemporalState<MessageStore>) => T
) => useStore(useCurrentMessageStore.temporal, selector);
