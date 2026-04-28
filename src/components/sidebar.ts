import {
  Box,
  BoxRenderable,
  instantiate,
  KeyEvent,
  Select,
  SelectRenderableEvents,
  type RenderContext,
} from "@opentui/core";
import { readJournalsIndex } from "../journalStorage";

interface SideBarListItem {
  name: string;
  description: string;
}

export function sidebarComponent(renderer: RenderContext) {
  const journals = readJournalsIndex();
  const sidebarList: SideBarListItem[] = journals.journals.map((j) => {
    return { name: j.title, description: j.journalId };
  });
  let selectedJournalIndex = 0;
  const selectComponent = instantiate(
    renderer,
    Select({
      height: "100%",
      options: sidebarList,
      itemSpacing: 1,
      showScrollIndicator: false,
    }),
  );
  const sidebar = instantiate(
    renderer,
    Box(
      {
        id: "sidebar-container",
        title: "Journal Enteries",
        titleAlignment: "center",
        backgroundColor: "#1a1a1a",
        border: true,
        borderColor: "#696969",
        height: "100%",
        width: 30,
        flexDirection: "column",
        gap: 1,
        justifyContent: "flex-start",
        padding: 1,
      },
      selectComponent,
    ),
  ) as BoxRenderable;

  selectComponent.on(
    SelectRenderableEvents.SELECTION_CHANGED,
    (index: number) => {
      selectedJournalIndex = index;
    },
  );

  selectComponent.on(SelectRenderableEvents.ITEM_SELECTED, (index) => {
    console.log(`Journal ${index} selected`);
  });

  return {
    id: "sidebar",
    renderable: sidebar,
    selectComponent,
    getSelectorIndex: () => journals.journals[selectedJournalIndex],
    onKeypress: (key: KeyEvent) => {
      if (key.name === "enter") {
        return true;
      }
      return true;
    },
    updateBorderColor: (focus: boolean) => {
      sidebar.borderColor = focus ? "#FF6600" : "#696969";
    },
    // refreshSidebar: listJournalFile(),
  };
}
