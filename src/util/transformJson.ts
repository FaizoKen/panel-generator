import { usePanelVarStore } from "../state/panelvar";
import { generateGuide } from "../util/guidegen";
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

const locData = () => usePanelVarStore.getState().loc;


export type Panel = {
  api_get: string | null;
  raw_data: {
    message: string | null;
    panels: {
      is_name: boolean;
      is_guide: boolean;
      is_rule: boolean;
      is_setting: boolean;
      is_menu: boolean;
      is_button: boolean;
      lang: string;
      msg_color: string | null;
      menu_name: string | null;
      button_color: string;
      button_emoji: string  | null;
      button_name: string;
      image: string | null;
      title: string | null;
      description: string | null;
      desc_image: string | null;
      url: string | null;
    };
    modals: Array<{
      name: string | null;
      placeholder: string | null;
      value: string | null;
      style: string;
      required: boolean;
      minLength: string | null;
      maxLength: string | null;
    }>;
    options: Array<{
      emoji: string | null;
      label: string | null;
      description: string | null;
      msg_image: string | null;
      msg_description: string | null;
      msg_color: string | null;
      url: string | null;
    }>;
  };
};

const colorMap: { [key: string]: number } = {
  DEFAULT: 0x000000,
  WHITE: 0xffffff,
  AQUA: 0x1abc9c,
  GREEN: 0x57f287,
  BLUE: 0x3498db,
  YELLOW: 0xfee75c,
  PURPLE: 0x9b59b6,
  LUMINOUS_VIVID_PINK: 0xe91e63,
  FUCHSIA: 0xeb459e,
  GOLD: 0xf1c40f,
  ORANGE: 0xe67e22,
  RED: 0xed4245,
  GREY: 0x95a5a6,
  NAVY: 0x34495e,
  DARK_AQUA: 0x11806a,
  DARK_GREEN: 0x1f8b4c,
  DARK_BLUE: 0x206694,
  DARK_PURPLE: 0x71368a,
  DARK_VIVID_PINK: 0xad1457,
  DARK_GOLD: 0xc27c0e,
  DARK_ORANGE: 0xa84300,
  DARK_RED: 0x992d22,
  DARK_GREY: 0x979c9f,
  DARKER_GREY: 0x7f8c8d,
  LIGHT_GREY: 0xbcc0c0,
  DARK_NAVY: 0x2c3e50,
  BLURPLE: 0x5865f2,
  GREYPLE: 0x99aab5,
  DARK_BUT_NOT_BLACK: 0x2c2f33,
  NOT_QUITE_BLACK: 0x23272a,
};

const getColor = (color: string | null): number | undefined => {
  if (!color) return undefined;
  if (color.startsWith('#')) {
    return parseInt(color.replace('#', ''), 16);
  }
  return colorMap[color.toUpperCase()] || undefined;
};

export function transformJson(input: Panel): Message {
  const embeds = [];

  const getImageUrl = (url: string) => url.startsWith('http') ? url : `https://i.imgur.com/${url}`;

  const embed: MessageEmbed = {
    id: 1,
    fields: [],
    hidden: false,
  };

  if (input.raw_data.panels.msg_color) {
    embed.color = getColor(input.raw_data.panels.msg_color);
  }

  if (input.raw_data.panels.is_name) {
    embed.author = {
      name: locData().guildName,
      icon_url: locData().guildIconUrl,
    };
  }

  if (input.raw_data.panels.image) {
    embed.image = {
      url: getImageUrl(input.raw_data.panels.image),
    };
  }

  embeds.push(embed);

  const embed2: MessageEmbed = { 
    id: Math.floor(Math.random() * 1000), 
    fields: [], 
    hidden: false 
  }; // Changed to random number

  if (input.raw_data.panels.title) embed2.title = input.raw_data.panels.title;
  if (input.raw_data.panels.msg_color) {
    embed2.color = getColor(input.raw_data.panels.msg_color);
  }
  if (input.raw_data.panels.description) embed2.description = input.raw_data.panels.description;
  if (input.raw_data.panels.url) embed2.url = input.raw_data.panels.url;
  if (input.raw_data.panels.desc_image) 
    embed2.image = { url: getImageUrl(input.raw_data.panels.desc_image) };
  embed2.id = 2;
  embeds.push(embed2);

  const embed3: MessageEmbed = { 
    id: Math.floor(Math.random() * 1000), 
    hidden: false, 
    fields: [] 
  }; // Changed to random number

  if (input.raw_data.panels.msg_color) {
    embed3.color = getColor(input.raw_data.panels.msg_color);
  }

  const guideData = generateGuide(getColor(input.raw_data.panels.msg_color));

  if (input.raw_data.panels.is_guide) {
    if (guideData.title) embed3.title = guideData.title;
    if (guideData.fields?.length) 
      embed3.fields = guideData.fields.flatMap((item) => item || []);
  }  
  embed3.id = 3;
  embeds.push(embed3);
  

  const buttonEmojiMatch = input.raw_data.panels.button_emoji ? input.raw_data.panels.button_emoji.match(/<a?:(\w+):(\d+)>/) : null;
  const buttonEmoji = buttonEmojiMatch ? {
    id: buttonEmojiMatch[2],
    name: buttonEmojiMatch[1],
    animated: buttonEmojiMatch[0].startsWith('<a:')
  } : undefined;

  return {
    apiInt: input.api_get ?? "",
    content: input.raw_data.message ?? "",
    embeds: embeds,
    components: [
      {
        id: Math.floor(Math.random() * 1000), // Changed to random number
        type: 1,
        components: [
          {
            id: Math.floor(Math.random() * 1000), // Changed to random number
            type: 3,
            placeholder: input.raw_data.panels.menu_name ?? undefined,
            hidden: !input.raw_data.panels.is_menu,
            options: input.raw_data.options.map((option, index) => {
              const optionEmojiMatch = option.emoji ? option.emoji.match(/<a?:(\w+):(\d+)>/) : null;
              const optionEmoji = optionEmojiMatch ? {
                id: optionEmojiMatch[2],
                name: optionEmojiMatch[1],
                animated: optionEmojiMatch[0].startsWith('<a:')
              } : undefined;
              return {
                id: index,
                label: option.label ?? '',
                description: option.description ?? undefined,
                message_response: {
                  description: option.msg_description ?? undefined,
                  url: option.url ?? undefined,
                  image_url: option.msg_image ? getImageUrl(option.msg_image) : '',
                  color: option.msg_color ? getColor(option.msg_color) : undefined,
                },
                emoji: optionEmoji,
              };
            }),
          }
        ]
      },
      {
        id: Math.floor(Math.random() * 1000), // Changed to random number
        type: 1,
        components: [
          {
            id: 10,
            type: 2,
            style: input.raw_data.panels.button_color === "PRIMARY" ? 1 :
            input.raw_data.panels.button_color === "SECONDARY" ? 2 :
            input.raw_data.panels.button_color === "SUCCESS" ? 3 :
            input.raw_data.panels.button_color === "DANGER" ? 4 : 1,
            label: input.raw_data.panels.button_name,
            emoji: buttonEmoji,
            hidden: !input.raw_data.panels.is_button,
            modals: input.raw_data.modals.map((modal, index) => {
              const modalObj: any = {
                id: index,
                name: modal.name ?? "", // Ensure name is a string
                placeholder: modal.placeholder ?? "", // Ensure placeholder is a string
                value: modal.value || "",
                style: modal.style === "SHORT" ? 1 : modal.style === "PARAGRAPH" ? 2 : 1,
                required: modal.required,
              };
              if (modal.minLength && parseInt(modal.minLength, 10) > 0) {
                modalObj.minLength = parseInt(modal.minLength, 10);
              }
              if (modal.maxLength && parseInt(modal.maxLength, 10) > 0) {
                modalObj.maxLength = parseInt(modal.maxLength, 10);
              }
              return modalObj;
            }),
          },
          {
            id: 11,
            type: 2, // Ensure type is 2
            style: 5, // Ensure style is 5
            label: "Server Rules",
            emoji: {
              name: "📋",
              animated: false
            },
            url: "https://discord.com",
            hidden: !input.raw_data.panels.is_rule,
          },
          {
            id: 12,
            type: 2, // Ensure type is 2
            style: 2, // Ensure style is 2
            label: "",
            emoji: {
              name: "⚙️",
              animated: false
            },
            hidden: !input.raw_data.panels.is_setting,
            modals: [],
          }
        ]
      }
    ]
  };
}