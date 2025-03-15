import { usePanelVarStore } from "../state/panelvar";
import { generateGuide } from "../util/guidegen";

const locData = () => usePanelVarStore.getState().loc;
const guideData = generateGuide();

type InputJson = {
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
      msg_color: number;
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

type OutputJson = {
  apiInt: string;
  content: string;
  embeds: Array<{
    id: number;
    color: number;
    image?: {
      url: string;
    };
    fields: Array<{
      id: number;
      name: string;
      value: string;
      inline: boolean;
    }>;
    hidden: boolean;
    author?: {
      name: string;
      icon_url?: string;
    };
    title?: string;
    description?: string;
    url?: string;
  }>;
  components: Array<{
    id: number;
    type: number;
    components: Array<{
      id: number;
      type: number;
      placeholder?: string;
      hidden: boolean;
      options?: Array<{
        id: number;
        label: string;
        description: string;
        message_response: {
          description: string;
          url: string;
          image_url: string;
          color: number;
        };
        emoji: {
          id: string;
          name: string;
          animated: boolean;
        };
      }>;
      style?: number;
      label?: string;
      emoji?: {
        id?: string;
        name: string;
        animated: boolean;
      };
      url?: string;
      modals?: Array<{
        id: number;
        name: string;
        placeholder: string;
        value: string;
        style: number;
        minLength: number;
        maxLength: number;
        required: boolean;
      }>;
    }>;
  }>;
};

export function transformJson(input: InputJson): OutputJson {
  const embeds = [];

  if (input.raw_data.panels.is_name) {
    embeds.push({
      id: 1,
      color: input.raw_data.panels.msg_color,
      fields: [],
      hidden: false,
      author: {
        name: locData().guildName,
        icon_url: locData().guildIconUrl,
      },
      image: {
        url: input.raw_data.panels.image,
      },
    });
  }

  if (input.raw_data.panels.title) {
    embeds.push({
      id: 2,
      title: input.raw_data.panels.title,
      color: input.raw_data.panels.msg_color,
      fields: [],
      hidden: false,
    });
  }

  if (input.raw_data.panels.is_guide) {
    embeds.push({
      id: 3,
      title: guideData.title,
      color: input.raw_data.panels.msg_color,
      fields: guideData.fields.flatMap((item) => item || []),
      hidden: false,
    });
  }

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
        id: 1,
        type: 1,
        components: [
          {
            id: 1,
            type: 3,
            placeholder: input.raw_data.panels.menu_name,
            hidden: false,
          }
        ]
      },
      {
        id: 1,
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
          }
        ]
      }
    ]
  };
}