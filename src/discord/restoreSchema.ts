import { z } from "zod";
import { getUniqueId } from "../util";

export const uniqueIdSchema = z.preprocess(
  (d) => {
    if (d === null || typeof d !== "number") {
      return undefined;
    }
    return d;
  },
  z.number().default(() => getUniqueId())
);

export type UniqueId = z.infer<typeof uniqueIdSchema>;

export const embedFooterTextSchema = z.preprocess(
  (d) => d ?? undefined,
  z.optional(z.string())
);

export type EmbedFooterText = z.infer<typeof embedFooterTextSchema>;

export const embedFooterIconUrlSchema = z.preprocess(
  (d) => d ?? undefined,
  z.optional(z.string())
);

export type EmbedFooterIconUrl = z.infer<typeof embedFooterIconUrlSchema>;

export const embedFooterSchema = z.preprocess(
  (d) => d ?? undefined,
  z.optional(
    z.object({
      text: embedFooterTextSchema,
      icon_url: embedFooterIconUrlSchema,
    })
  )
);

export type EmbedFooter = z.infer<typeof embedFooterSchema>;

export const embedImageUrlSchema = z.preprocess(
  (d) => d ?? undefined,
  z.optional(z.string())
);

export type EmbedImageUrl = z.infer<typeof embedImageUrlSchema>;

export const embedImageSchema = z.preprocess(
  (d) => d ?? undefined,
  z.optional(
    z.object({
      url: embedImageUrlSchema,
    })
  )
);

export type EmbedImage = z.infer<typeof embedImageSchema>;

export const embedThumbnailUrlSchema = z.preprocess(
  (d) => d ?? undefined,
  z.optional(z.string())
);

export type EmbedThumbnailUrl = z.infer<typeof embedThumbnailUrlSchema>;

export const embedThumbnailSchema = z.preprocess(
  (d) => d ?? undefined,
  z.optional(
    z.object({
      url: embedThumbnailUrlSchema,
    })
  )
);

export type EmbedThumbnail = z.infer<typeof embedThumbnailSchema>;

export const embedAuthorNameSchema = z.preprocess(
  (d) => d ?? undefined,
  z.string().default("")
);

export type EmbedAuthorName = z.infer<typeof embedAuthorNameSchema>;

export const embedAuthorUrlSchema = z.preprocess(
  (d) => d ?? undefined,
  z.optional(z.string())
);

export type EmbedAuthorUrl = z.infer<typeof embedAuthorUrlSchema>;

export const embedAuthorIconUrlSchema = z.preprocess(
  (d) => d ?? undefined,
  z.optional(z.string())
);

export type EmbedAuthorIconUrl = z.infer<typeof embedAuthorIconUrlSchema>;

export const embedAuthorSchema = z.preprocess(
  (d) => d ?? undefined,
  z.optional(
    z.object({
      name: embedAuthorNameSchema,
      url: embedAuthorUrlSchema,
      icon_url: embedAuthorIconUrlSchema,
    })
  )
);

export type EmbedAuthor = z.infer<typeof embedAuthorSchema>;

export const embedProviderNameSchema = z.preprocess(
  (d) => d ?? undefined,
  z.string().default("")
);

export type EmbedProviderName = z.infer<typeof embedProviderNameSchema>;

export const embedProviderUrlSchema = z.preprocess(
  (d) => d ?? undefined,
  z.optional(z.string())
);

export type EmbedProviderUrl = z.infer<typeof embedProviderUrlSchema>;

export const embedProviderSchema = z.preprocess(
  (d) => d ?? undefined,
  z.optional(
    z.object({
      name: embedProviderNameSchema,
      url: embedProviderUrlSchema,
    })
  )
);

export type EmbedProvider = z.infer<typeof embedProviderSchema>;

export const embedFieldNameSchema = z.preprocess(
  (d) => d ?? undefined,
  z.string().default("")
);

export type EmbedFieldName = z.infer<typeof embedFieldNameSchema>;

export const embedFieldValueSchema = z.preprocess(
  (d) => d ?? undefined,
  z.string().default("")
);

export type EmbedFieldValue = z.infer<typeof embedFieldValueSchema>;

export const embedFieldInlineSchma = z.preprocess(
  (d) => d ?? undefined,
  z.optional(z.boolean())
);

export type EmbedFieldInline = z.infer<typeof embedFieldInlineSchma>;

export const embedFieldSchema = z.object({
  id: uniqueIdSchema,
  name: embedFieldNameSchema,
  value: embedFieldValueSchema,
  inline: embedFieldInlineSchma,
});

export type EmbedField = z.infer<typeof embedFieldSchema>;

export const embedtitleSchema = z.preprocess(
  (d) => d ?? undefined,
  z.optional(z.string())
);

export type EmbedTitle = z.infer<typeof embedtitleSchema>;

export const embedDescriptionSchema = z.preprocess(
  (d) => d ?? undefined,
  z.optional(z.string())
);

export type EmbedDescription = z.infer<typeof embedDescriptionSchema>;

export const embedUrlSchema = z.preprocess(
  (d) => d ?? undefined,
  z.optional(z.string())
);

export type EmbedUrl = z.infer<typeof embedUrlSchema>;

export const embedTimestampSchema = z.preprocess(
  (d) => d ?? undefined,
  z.optional(z.string())
);

export type EmbedTimestamp = z.infer<typeof embedTimestampSchema>;

export const embedColor = z.preprocess(
  (d) => d ?? undefined,
  z.optional(z.number())
);

export type EmbedColor = z.infer<typeof embedColor>;

export const embedSchema = z.object({
  id: uniqueIdSchema,
  title: embedtitleSchema,
  description: embedDescriptionSchema,
  url: embedUrlSchema,
  timestamp: embedTimestampSchema,
  color: embedColor,
  footer: embedFooterSchema,
  author: embedAuthorSchema,
  provider: embedProviderSchema,
  image: embedImageSchema,
  thumbnail: embedThumbnailSchema,
  fields: z.preprocess(
    (d) => d ?? undefined,
    z.array(embedFieldSchema).default([])
  ),
  hidden: z.boolean().optional().default(false),
});

export type MessageEmbed = z.infer<typeof embedSchema>;

export const emojiSchema = z.object({
  id: z.optional(z.string()),
  name: z.preprocess((d) => d ?? undefined, z.string().default("")),
  animated: z.preprocess((d) => d ?? undefined, z.boolean().default(false)),
});

export const responseSchema = z.object({
  image_url: z.preprocess((d) => d || undefined, z.optional(z.string())),
  description: z.preprocess((d) => d || undefined, z.optional(z.string())),
  color: z.preprocess( (d) => d ?? undefined, z.optional(z.number()) ),
  url: z.preprocess((d) => d || undefined, z.optional(z.string())),
});

export type Emoji = z.infer<typeof emojiSchema>;

export const buttonStyleSchema = z
  .literal(1)
  .or(z.literal(2))
  .or(z.literal(3))
  .or(z.literal(4))
  .or(z.literal(5));

  export const buttonModalSchema = z.object({
    id: uniqueIdSchema.default(() => getUniqueId()),
    name: z.string().max(100).default(""),
    placeholder: z.string().max(100).default(""),
    value: z.string().max(100).default(""),
    style: z.literal(1).or(z.literal(2)).default(1),
    required: z.optional(z.boolean()),
    minLength: z.optional(z.number().min(1).max(1000)),
    maxLength: z.optional(z.number().min(1).max(1000)),
  });
  
  export type MessageComponentButtonModal = z.infer<
    typeof buttonModalSchema
  >;

export type MessageComponentButtonStyle = z.infer<typeof buttonStyleSchema>;

export const buttonSchema = z
  .object({
    id: uniqueIdSchema,
    type: z.literal(2),
    style: z.literal(1).or(z.literal(2)).or(z.literal(3)).or(z.literal(4)),
    label: z.preprocess((d) => d ?? undefined, z.string().default("")),
    emoji: z.optional(z.nullable(emojiSchema)),
    hidden: z.preprocess((d) => d ?? undefined, z.optional(z.boolean())),
    modals: z.array(buttonModalSchema).max(5).default([]),
  })
  .or(
    z.object({
      id: uniqueIdSchema,
      type: z.literal(2),
      style: z.literal(5),
      label: z.preprocess((d) => d ?? undefined, z.string().default("")),
      emoji: z.optional(z.nullable(emojiSchema)),
      url: z.preprocess((d) => d ?? undefined, z.string().default("")),
      hidden: z.preprocess((d) => d ?? undefined, z.optional(z.boolean())),
    })
  );

export type MessageComponentButton = z.infer<typeof buttonSchema>;

export const selectMenuOptionSchema = z.object({
  id: uniqueIdSchema,
  label: z.preprocess((d) => d ?? undefined, z.string().default("")),
  description: z.preprocess((d) => d || undefined, z.optional(z.string())),
  message_response: z.preprocess( (d) => (d == null ? {} : d), responseSchema ),
  emoji: z.preprocess((d) => d ?? undefined, z.optional(emojiSchema)),
});

export type MessageComponentSelectMenuOption = z.infer<
  typeof selectMenuOptionSchema
>;

export const selectMenuSchema = z.object({
  id: uniqueIdSchema,
  type: z.literal(3),
  placeholder: z.preprocess((d) => d ?? undefined, z.optional(z.string())),
  hidden: z.preprocess((d) => d ?? undefined, z.optional(z.boolean())),
  options: z.preprocess(
    (d) => d ?? undefined,
    z.array(selectMenuOptionSchema).default([])
  ),
});

export type MessageComponentSelectMenu = z.infer<typeof selectMenuSchema>;

export const actionRowSchema = z.object({
  id: uniqueIdSchema,
  type: z.preprocess((d) => d ?? undefined, z.literal(1).default(1)),
  components: z.preprocess(
    (d) => d ?? undefined,
    z.array(buttonSchema.or(selectMenuSchema)).default([])
  ),
});

export type MessageComponentActionRow = z.infer<typeof actionRowSchema>;

export const messageActionSchema = z
  .object({
    type: z.literal(1).or(z.literal(6)).or(z.literal(8)), // text response
    id: uniqueIdSchema,
    text: z.preprocess((d) => d ?? undefined, z.string().default("")),
    public: z.preprocess((d) => d ?? undefined, z.boolean().default(false)),
  })
  .or(
    z.object({
      type: z.literal(5).or(z.literal(7)).or(z.literal(9)), // saved messages responses, // toggle, add, remove role
      id: uniqueIdSchema,
      target_id: z.string(),
      public: z.preprocess((d) => d ?? undefined, z.boolean().default(false)),
    })
  )
  .or(
    z.object({
      type: z.literal(2).or(z.literal(3)).or(z.literal(4)), // toggle, add, remove role
      id: uniqueIdSchema.default(() => getUniqueId()),
      target_id: z.string(),
      public: z.preprocess((d) => d ?? undefined, z.boolean().default(false)),
      disable_default_response: z.preprocess(
        (d) => d ?? undefined,
        z.boolean().default(false)
      ),
    })
  )
  .or(
    z.object({
      type: z.literal(10), // permission check
      id: uniqueIdSchema.default(() => getUniqueId()),
      permissions: z.preprocess((d) => d ?? undefined, z.string().default("0")),
      role_ids: z.preprocess(
        (d) => d ?? undefined,
        z.array(z.string()).default([])
      ),
      disable_default_response: z.preprocess(
        (d) => d ?? undefined,
        z.boolean().default(false)
      ),
      text: z.preprocess((d) => d ?? undefined, z.string().default("")),
    })
  );

export type MessageAction = z.infer<typeof messageActionSchema>;

export const messageActionSetSchema = z.object({
  actions: z.array(messageActionSchema),
});

export type MessageActionSet = z.infer<typeof messageActionSetSchema>;

export const messageContentSchema = z.preprocess(
  (d) => d ?? undefined, z.string().default("") );

  export const apiIntSchema = z.preprocess(
    (d) => d ?? undefined, z.string().default("") );

export type MessageContent = z.infer<typeof messageContentSchema>;

export const webhookUsernameSchema = z.preprocess(
  (d) => d ?? undefined,
  z.optional(z.string())
);

export type WebhookUsername = z.infer<typeof webhookUsernameSchema>;

export const webhookAvatarUrlSchema = z.preprocess(
  (d) => d ?? undefined,
  z.optional(z.string())
);

export type WebhookAvatarUrl = z.infer<typeof webhookAvatarUrlSchema>;


export const messageAllowedMentionsSchema = z.preprocess(
  (d) => d ?? undefined,
  z.optional(
    z.object({
      parse: z.array(
        z.literal("users").or(z.literal("roles")).or(z.literal("everyone"))
      ),
      roles: z.array(z.string()),
      users: z.array(z.string()),
      replied_user: z.boolean(),
    })
  )
);

export const messageThreadName = z.optional(z.string());

export const messageSchema = z.object({
  apiInt: z.preprocess( (d) => d ?? undefined, apiIntSchema.default("") ),
  content: z.preprocess( (d) => d ?? undefined, messageContentSchema.default("") ),
  username: webhookUsernameSchema,
  avatar_url: webhookAvatarUrlSchema,
  embeds: z.preprocess((d) => d ?? undefined, z.array(embedSchema).default([])),
  allowed_mentions: messageAllowedMentionsSchema,
  components: z.preprocess(
    (d) => d ?? undefined,
    z.array(actionRowSchema).default([])
  ),
  thread_name: messageThreadName,
});

export type Message = z.infer<typeof messageSchema>;

export function parseMessageWithAction(raw: any) {
  const parsedData = messageSchema.parse(raw);

  return parsedData;
}
