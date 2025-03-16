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
import { transformJson, Panel } from "../util/transformJson";

const getAuthorData = () => {
  const author = usePanelVarStore.getState().loc;
  return author;
};

export interface MessageStore extends Message {
  clear(): void;
  replace(message: Message): void;
  setContent: (content: string) => void;
  setapiInt: (apiInt: string) => void;
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


export const emptyMessage: Message = {
  apiInt: "",
  content: "",
  embeds: [],
  components: [],
};

     const dataDefault: Panel = {
        "api_get": null,
        "raw_data": {
          "message": null,
          "panels": {
            "is_name": true,
            "is_guide": true,
            "is_rule": true,
            "is_setting": true,
            "is_menu": true,
            "is_button": true,
            "lang": "en",
            "msg_color": "#3498db",
            "menu_name": "Frequently Asked Question (FAQ)",
            "button_color": "PRIMARY",
            "button_emoji": "<:logo:1281113840280539137>",
            "button_name": "Contact Support",
            "image": "jVtMuP1.png",
            "title": null,
            "description": null,
            "desc_image": null,
            "url": null
          },
          "modals": [
            {
              "name": "Topic",
              "placeholder": "Enter the topic",
              "value": null,
              "style": "SHORT",
              "required": false,
              "minLength": "0",
              "maxLength": "100"
            },
            {
              "name": "Feedback / Questions",
              "placeholder": "Please explain the reason",
              "value": null,
              "style": "PARAGRAPH",
              "required": true,
              "minLength": "0",
              "maxLength": "1000"
            }
          ],
          "options": [
            {
              "emoji": "<:discord:1298193629625716776>",
              "label": "Discord – Community Guidelines",
              "description": "Discord",
              "msg_image": "IvJ3ifV.png",
              "msg_description": "The **Discord Community Guidelines** set rules to ensure a safe and positive environment for all users. Key points include:\r\n\r\n1. **Respect for Others**: Users must not engage in harassment, hate speech, bullying, or discriminatory behavior.\r\n   \r\n2. **No Harmful Content**: Sharing illegal, violent, or adult content, including graphic violence or nudity, is strictly prohibited.\r\n\r\n3. **Prohibited Activities**: Scams, fraud, promotion of dangerous or illegal activities, doxing (sharing private information without consent), and spamming are banned.\r\n\r\n4. **Respect Privacy**: Do not record or distribute conversations without consent, and avoid sharing personal information.\r\n\r\n5. **No Exploitation**: Manipulating the platform, distributing malware, hacking, or using self-bots is forbidden.\r\n\r\n6. **Authenticity**: Users should not impersonate others, and accounts should reflect genuine interactions.\r\n\r\n7. **Age Restrictions**: Users must be at least 13 years old (or older depending on local laws).\r\n\r\n8. **Bot and Automation Use**: Bots must comply with Discord’s API and should not spam or overwhelm users.\r\n\r\nThese guidelines promote a respectful, safe, and positive community experience for all members. Violating them can result in account suspension or permanent bans.",
              "msg_color": "BLUE",
              "url": "https://discord.com/guidelines"
            },
            {
              "emoji": "<:discord:1298193629625716776>",
              "label": "Discord – Privacy Policy",
              "description": "Discord",
              "msg_image": "IvJ3ifV.png",
              "msg_description": "The **Discord Privacy Policy** explains how Discord collects, uses, and shares personal data to provide and improve its services. Key points include:\r\n\r\n1. **Data Collection**:\r\n   - **Account Information**: Discord collects information when you create an account, including your username, email, and IP address.\r\n   - **Usage Data**: Discord gathers data on how you interact with the platform (messages, voice chats, servers you join, etc.).\r\n   - **Device Information**: Information like your operating system, device type, and settings may be collected.\r\n   - **Third-Party Services**: If you connect external accounts (e.g., Spotify, YouTube), Discord may collect related data.\r\n\r\n2. **Data Use**:\r\n   - **Service Provision**: Your data is used to provide, maintain, and improve Discord’s services.\r\n   - **Personalization**: Discord uses data to tailor features and recommendations to individual users.\r\n   - **Safety and Security**: Data is used to detect and prevent harmful activities, enforce guidelines, and maintain security.\r\n   - **Communication**: Discord may use data to send you updates or promotional content.\r\n\r\n3. **Data Sharing**:\r\n   - Discord shares data with third-party service providers (like payment processors) to run the service but doesn’t sell user data.\r\n   - It may share information for legal compliance, protecting users, or in case of mergers and acquisitions.\r\n\r\n4. **Data Control**:\r\n   - **User Control**: Users can access, correct, or delete their personal data, and can manage privacy settings.\r\n   - **Retention**: Discord retains data as long as necessary to provide services or meet legal obligations.\r\n   - **Data Protection**: Discord uses encryption and other security measures to protect user data.\r\n\r\n5. **Children's Privacy**: Discord requires users to be at least 13 years old (or older in some jurisdictions).\r\n\r\n6. **International Data Transfers**: User data may be transferred internationally, with protections in place for data shared outside of the user’s country.\r\n\r\nOverall, Discord prioritizes user privacy while using collected data to enhance the platform and ensure a secure environment.",
              "msg_color": "BLUE",
              "url": "https://discord.com/privacy"
            },
            {
              "emoji": "<:discord:1298193629625716776>",
              "label": "Discord – Terms of Service",
              "description": "Discord",
              "msg_image": "IvJ3ifV.png",
              "msg_description": "The **Discord Terms of Service** outline the rules and conditions users must follow when using Discord's platform. Key points include:\r\n\r\n1. **Account Eligibility**:\r\n   - Users must be at least 13 years old, or older if required by local laws.\r\n   - You are responsible for your account's security and all activities on it. Discord can disable accounts for rule violations.\r\n\r\n2. **User Conduct**:\r\n   - Users must follow community guidelines, avoiding illegal activities, harassment, and harmful content.\r\n   - Use of the platform should not violate intellectual property rights or local laws.\r\n   - Automated bots or scripts (like self-bots) should not interfere with Discord’s operations or other users.\r\n\r\n3. **Content Ownership**:\r\n   - Users retain ownership of the content they post but grant Discord a license to use, distribute, and display that content as part of their service.\r\n   - Discord may remove content that violates its policies or laws.\r\n\r\n4. **Platform Use**:\r\n   - Discord is provided \"as-is\" without warranties, meaning users cannot hold Discord liable for technical issues or disruptions.\r\n   - Discord can modify or terminate services at any time, with or without notice.\r\n\r\n5. **Purchases and Payments**:\r\n   - For premium services like Nitro, users agree to pay the listed prices. Payments may auto-renew unless canceled.\r\n   - Refunds are generally not offered unless required by law.\r\n\r\n6. **Termination**:\r\n   - Discord may suspend or delete accounts that violate the Terms of Service or other policies.\r\n   - Users can terminate their account anytime by deleting it.\r\n\r\n7. **Dispute Resolution**:\r\n   - Most disputes between users and Discord are handled via arbitration, not court.\r\n   - Legal claims must be filed within one year of the dispute, and class action lawsuits are generally not allowed.\r\n\r\n8. **Limitation of Liability**:\r\n   - Discord's liability for damages is limited, and the company is not responsible for user-generated content.\r\n\r\nBy using Discord, users agree to these terms and must comply with the rules to maintain access to the platform.",
              "msg_color": "BLUE",
              "url": "https://discord.com/terms"
            }
          ]
        }
      };

      export const defaultMessage: Message = transformJson(dataDefault);

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
            setapiInt: (apiInt: string) => set({ apiInt }),
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
                
                      if (guideData) {
                
                        embed.title = guideData.title;
                        embed.color = guideData.color;
                        embed.fields = guideData.fields.flatMap((item) => item || []);
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
                    } else if (comp.type === 3) {
                      for (const option of comp.options) {
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
                      return { ...comp };
                    } else {
                      return {
                        ...comp,
                        options: comp.options.map((option) => {
                          const actionId = getUniqueId().toString();
                          return {
                            ...option,
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
                    } else if (comp.type === 3) {
                      for (const option of comp.options) {
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

                row.components.splice(j + 1, 0, {
                  ...button,
                  id: getUniqueId(),
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
                button.hidden = disabled;
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
                selectMenu.hidden = disabled;
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

                selectMenu.options.splice(k + 1, 0, {
                  ...option,
                  id: getUniqueId(),
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
              }),
            clearActions: (id: string) =>
              set((state) => {
              }),
            deleteAction: (id: string, i: number) =>
              set((state) => {
              }),
            moveActionUp: (id: string, i: number) =>
              set((state) => {
              }),
            moveActionDown: (id: string, i: number) => {
              set((state) => {
              });
            },
            duplicateAction: (id: string, i: number) => {
              set((state) => {
              });
            },
            setActionType: (id: string, i: number, type: number) =>
              set((state) => {
              }),
            setActionText: (id: string, i: number, text: string) =>
              set((state) => {
              }),
            setActionTargetId: (id: string, i: number, target: string) =>
              set((state) => {
              }),
            setActionPublic: (id: string, i: number, val: boolean) =>
              set((state) => {
              }),
            setActionDisableDefaultResponse: (
              id: string,
              i: number,
              val: boolean
            ) =>
              set((state) => {
              }),
            setActionPermissions: (id: string, i: number, val: string) =>
              set((state) => {
              }),
            setActionRoleIds: (id: string, i: number, val: string[]) =>
              set((state) => {
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
