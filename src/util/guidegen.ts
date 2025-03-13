import { usePanelVarStore } from "../state/panelvar";
import { useCurrentMessageStore } from "../state/message";

export function generateGuide() {
    const loc = usePanelVarStore.getState().loc;
    const domain = window.location.origin;
    
    // Ensure the store has valid data before accessing properties
    const embedColor = useCurrentMessageStore.getState().embeds?.[0]?.color ?? 0;

    // Define the expected type explicitly
    interface Field {
        id: number;
        name: string;
        value: string;
        inline: boolean;
    }

    interface Guide {
        id: number;
        title: string;
        color: number;
        fields: Field[];
    }

    // Default structure with proper typing
    let guide: Guide[] = [
        {
            id: 3,
            title: "Need Assistance? Here's How to Reach Support",
            color: embedColor,
            fields: [],
        }
    ];

    if (loc.guideType === 1 || loc.guideType === 2) {
        guide[0].fields.push(
            {
                id: 351957694,
                name: "🎫 Support Button",
                value: "Click the button below to start a support thread",
                inline: true,
            },
            {
                id: 278423939,
                name: "🆘 Slash Command",
                value: "Type `/support` to start a support thread",
                inline: true,
            },
            {
                id: 551260849,
                name: "🌐 Website",
                value: `[Click Here](${domain}/ticket/${loc.panelMessageId}) to contact support from anywhere`,
                inline: true,
            }
        );
    }

    if (loc.guideType === 1) {
        guide[0].fields.push(
            {
                id: 258090459,
                name: "📩 Direct Message",
                value: "Send me a DM to start a support thread",
                inline: true,
            },
            {
                id: 781083436,
                name: "👤 Report User",
                value: "Right-click a user and choose **Report User**",
                inline: true,
            },
            {
                id: 382287250,
                name: "💬 Report Message",
                value: "Right-click a message and choose **Report Message**",
                inline: true,
            }
        );
    }

    return guide;
}
