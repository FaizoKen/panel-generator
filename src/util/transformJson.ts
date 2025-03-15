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
const guideData = generateGuide();

export type InputJson = {
  api_get: string;
  raw_data: {
    message: string;
    panels: {
      is_name: boolean;
      is_guide: boolean;
      is_rule: boolean;
      is_setting: boolean;
      is_menu: boolean;
      is_button: boolean;
      lang: string;
      msg_color: string;
      menu_name: string;
      button_color: string;
      button_emoji: string;
      button_name: string;
      image: string;
      title: string;
      description: string | null;
      desc_image: string | null;
      url: string | null;
    };
    modals: Array<{
      name: string;
      placeholder: string;
      value: string | null;
      style: string;
      required: boolean;
      minLength: string;
      maxLength: string;
    }>;
    options: Array<{
      emoji: string;
      label: string;
      description: string;
      msg_image: string;
      msg_description: string;
      msg_color: string;
      url: string;
    }>;
  };
};

export function transformJson(input: InputJson): Message {
  const embeds = [];

  const getImageUrl = (url: string) => url.startsWith('http') ? url : `https://i.imgur.com/${url}`;


  const embed: {
    id: number;
    color: number;
    fields: Array<{ id: number; value: string; name: string; inline?: boolean }>;
    hidden: boolean;
    author?: {
      name: string;
      icon_url?: string;
    };
    image?: {
      url: string;
    };
  } = {
    id: 1,
    color: parseInt(input.raw_data.panels.msg_color.replace('#', ''), 16),
    fields: [],
    hidden: false,
  };
  
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
  
  const embed2: { id: number; fields: { id: number; value: string; name: string; inline?: boolean }[]; hidden: boolean; title?: string; color?: number; description?: string | null; url?: string | null; image?: { url: string } } = { id: Math.floor(Math.random() * 1000), fields: [], hidden: false }; // Changed to random number

  if (input.raw_data.panels.title) embed2.title = input.raw_data.panels.title;
  if (input.raw_data.panels.msg_color) 
    embed2.color = parseInt(input.raw_data.panels.msg_color.replace('#', ''), 16);
  if (input.raw_data.panels.description) embed2.description = input.raw_data.panels.description;
  if (input.raw_data.panels.url) embed2.url = input.raw_data.panels.url;
  if (input.raw_data.panels.desc_image) 
    embed2.image = { url: getImageUrl(input.raw_data.panels.desc_image) };
  embed2.id = 2;
  embeds.push(embed2);

  const embed3: { id: number; hidden: boolean; color?: number; title?: string; fields: { id: number; value: string; name: string; inline?: boolean }[] } = { id: Math.floor(Math.random() * 1000), hidden: false, fields: [] }; // Changed to random number

  if (input.raw_data.panels.msg_color) 
    embed3.color = parseInt(input.raw_data.panels.msg_color.replace('#', ''), 16);
  
  if (input.raw_data.panels.is_guide) {
    if (guideData.title) embed3.title = guideData.title;
    if (guideData.fields?.length) 
      embed3.fields = guideData.fields.flatMap((item) => item || []);
  }  
  embed3.id = 3;
  embeds.push(embed3);
  

  const buttonEmojiMatch = input.raw_data.panels.button_emoji.match(/<a?:(\w+):(\d+)>/);
  const buttonEmoji = buttonEmojiMatch ? {
    id: buttonEmojiMatch[2],
    name: buttonEmojiMatch[1],
    animated: buttonEmojiMatch[0].startsWith('<a:')
  } : undefined;

  return {
    apiInt: input.api_get,
    content: input.raw_data.message,
    embeds: embeds,
    components: [
      {
        id: Math.floor(Math.random() * 1000), // Changed to random number
        type: 1,
        components: [
          {
            id: Math.floor(Math.random() * 1000), // Changed to random number
            type: 3,
            placeholder: input.raw_data.panels.menu_name,
            hidden: false,
            options: input.raw_data.options.map((option, index) => {
              const optionEmojiMatch = option.emoji.match(/<a?:(\w+):(\d+)>/);
              const optionEmoji = optionEmojiMatch ? {
                id: optionEmojiMatch[2],
                name: optionEmojiMatch[1],
                animated: optionEmojiMatch[0].startsWith('<a:')
              } : { id: '', name: '', animated: false };
              return {
                id: index,
                label: option.label,
                description: option.description,
                message_response: {
                  description: option.msg_description,
                  url: option.url,
                  image_url: option.msg_image ? getImageUrl(option.msg_image) : '',
                  color: parseInt(option.msg_color.replace('#', ''), 16),
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
            hidden: false,
            modals: input.raw_data.modals.map((modal, index) => {
              const modalObj: any = {
                id: index,
                name: modal.name,
                placeholder: modal.placeholder,
                value: modal.value || "",
                style: modal.style === "SHORT" ? 1 : modal.style === "PARAGRAPH" ? 2 : 1,
                required: modal.required,
              };
              if (parseInt(modal.minLength, 10) > 0) {
                modalObj.minLength = parseInt(modal.minLength, 10);
              }
              if (parseInt(modal.maxLength, 10) > 0) {
                modalObj.maxLength = parseInt(modal.maxLength, 10);
              }
              return modalObj;
            }),
          },
          {
            id: 11,
            type: 2,
            style: 5,
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
            type: 2,
            style: 2,
            label: "",
            emoji: {
              "name": "⚙️",
              "animated": false
            },
            hidden: !input.raw_data.panels.is_setting,
            modals: [],
          }
        ]
      }
    ]
  };
}