import { create } from "zustand";

interface Loc {
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
    guideType: 1,
    panelChannelId: "1273515158034976778",
    panelMessageId: "1327264637594632245",
    guildId: "1152851518228283392",
    ruleChannelId: "1294299660349083658",
    guildName: "Your Community",
    guildIconUrl:
      "https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/62fddf0fde45a8baedcc7ee5_847541504914fd33810e70a0ea73177e%20(2)-1.png",
  },
  int: {},
  setLoc: (loc) => set((state) => ({ loc: { ...state.loc, ...loc } })),
  setInt: (int) => set({ int }),
}));
