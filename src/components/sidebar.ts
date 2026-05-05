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
import { journalEvents, JournalEventType } from "../events/journalEvents";

interface SideBarListItem {
  name: string;
  description: string;
}

export function sidebarComponent(renderer: RenderContext) {
  let journals = readJournalsIndex();
  let sidebarList: SideBarListItem[] = journals.journals.map((j) => {
    return { name: j.title, description: j.journalId };
  });
  let selectedJournalIndex = 0;
  const selectComponent = instantiate(
    renderer,
    Select({
      height: "100%",
      options: sidebarList,
      itemSpacing: 1,
      showDescription: false,
      selectedTextColor: "#FFFF00",
      selectedIndex: -1,
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

  const refreshSidebar = () => {
    // cleanUp function - call this when the page is destroyed/left
    console.log("Sidebar refreshing...");
    journals = readJournalsIndex();
    sidebarList = journals.journals.map((j) => {
      return { name: j.title, description: j.journalId };
    });
    selectedJournalIndex = 0;
    (selectComponent as any).options = sidebarList;
    console.log("Sidebar refreshed");
  };

  const unsubscribe = journalEvents.subscribe(
    JournalEventType.INDEX_UPDATED,
    () => {
      refreshSidebar();
    },
  );

  console.log("Sidebar component created and subscribed to events");

  selectComponent.on(
    SelectRenderableEvents.SELECTION_CHANGED,
    (index: number) => {
      selectedJournalIndex = index;
    },
  );

  selectComponent.on(SelectRenderableEvents.ITEM_SELECTED, (index: number) => {
    console.log(`Journal ${index} selected`);
  });

  return {
    id: "sidebar",
    renderable: sidebar,
    selectComponent,
    getSelectorIndex: () => journals.journals[selectedJournalIndex] ?? null,
    onKeypress: (key: KeyEvent) => {
      if (key.name === "enter") {
        return true;
      }
      return true;
    },
    updateBorderColor: (focus: boolean) => {
      sidebar.borderColor = focus ? "#00FFFF" : "#696969";
    },
    cleanup: () => {
      console.log("Sidebar cleaning up");
      unsubscribe();
    },
  };
}
