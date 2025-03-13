import { create } from "zustand";

interface Loc {
  botName: string;
  botIconUrl: string;
  guideType: number;
  panelChannelId: string;
  panelMessageId: string;
  guildId: string;
  ruleChannelId: string;
  guildName: string;
  guildIconUrl: string;
}

interface Int {}

interface PanelVarStore {
  loc: Loc;
  int: Int;
  setLoc: (loc: Partial<Loc>) => void;
  setInt: (int: Int) => void;
}

export const usePanelVarStore = create<PanelVarStore>((set) => ({
  loc: {
    botName: "QuickSupport",
    botIconUrl: "https://cdn.discordapp.com/avatars/1280984633739186318/bc4438497b8c954b836b2fab77cae677.png?size=1024",
    guideType: 1,
    panelChannelId: "",
    panelMessageId: "",
    guildId: "",
    ruleChannelId: "",
    guildName: "Your Community",
    guildIconUrl:
      "https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/62fddf0fde45a8baedcc7ee5_847541504914fd33810e70a0ea73177e%20(2)-1.png",
  },
  int: {
    test: "ok",
    testBanner: "https://i.imgur.com/jVtMuP1.png"
  },
  setLoc: (loc) => set((state) => ({ loc: { ...state.loc, ...loc } })),
  setInt: (int) => set({ int }),
}));
