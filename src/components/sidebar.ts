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

export function sidebarComponent(
  renderer: RenderContext,
  options?: { onVisibilityChange?: (isVisible: boolean) => void },
) {
  let unsubscribe: (() => void) | null = null;
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

  // subscribe to INDEX_UPDATED event
  // called when journal page becomes visible (onEnter)
  // stores unsubscribe function so it can clean later
  const setupSubscription = () => {
    if (unsubscribe) {
      console.log("sidebar already subscribed");
      return;
    }
    unsubscribe = journalEvents.subscribe(
      JournalEventType.INDEX_UPDATED,
      () => {
        refreshSidebar();
      },
    );
    console.log("Sidebar subscribed to INDEX_UPDATED event");
  };

  // unsubscribe from INDEX_UPDATED event
  // called when journal page becomes hidden (onLeave)
  const tearDownSubscription = () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
      console.log("sidebar unsubscribed from INDEX_UPDATED event");
    }
  };

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
    refreshSidebar,
    setupSubscription,
    tearDownSubscription,
  };
}
