import {
  Box,
  BoxRenderable,
  instantiate,
  KeyEvent,
  RGBA,
  Select,
  SelectRenderableEvents,
  type RenderContext,
} from "@opentui/core";
import type { Store } from "../store/store";
import type { JournalService } from "../journalService";
import type { ComponentDefinition } from "../focusManager";
import type { JournalMetadata } from "../types/journal";

interface SideBarListItem {
  name: string;
  description: string;
}

export function sidebarComponent(
  renderer: RenderContext,
  store: Store,
  service: JournalService,
): ComponentDefinition {
  let unsubscribers: Array<() => void> = [];
  let journals: JournalMetadata[] = [];
  let selectedIndex = 0;

  let sidebarList: SideBarListItem[] = [];

  const selectComponent = instantiate(
    renderer,
    Select({
      height: "100%",
      options: sidebarList,
      itemSpacing: 1,
      showDescription: false,
      selectedTextColor: "#FFFF00",
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

  // update the list UI with current journals
  function updateList(journalList: JournalMetadata[]): void {
    journals = journalList;
    sidebarList = journalList.map((journal) => ({
      name: journal.title,
      description: journal.mood || "",
    }));
    (selectComponent as any).options = sidebarList;
    selectedIndex = 0;
    console.log("[Sidebar] list updated with", journalList.length, "journals");
  }

  // update the border color based on focus
  function updateBorderColor(isFocused: boolean): void {
    sidebar.borderColor = isFocused
      ? RGBA.fromHex("#00FFFF")
      : RGBA.fromHex("#696969");
  }

  // select the currently highlighted journal
  async function selectJournal(): Promise<void> {
    const selectedJournal = journals[selectedIndex];
    if (!selectedJournal) {
      console.warn("[Sidebar] no journal selected");
      return;
    }
    console.log("[Sidebar] loading journal:", selectedJournal.title);

    // call service to load journal
    const result = await service.loadJournal(selectedJournal.title);

    if (!result.success) {
      console.error("[Sidebar] failed to load journal:", result.message);
      return;
    }
  }

  selectComponent.on(
    SelectRenderableEvents.SELECTION_CHANGED,
    (index: number) => {
      selectedIndex = index;
      console.log("[Sidebar] selection changed to index:", index);
    },
  );

  selectComponent.on(SelectRenderableEvents.ITEM_SELECTED, async (index: number) => {
    selectedIndex = index;
    await selectJournal();
  })

  service.listJournals().then(updateList);
  store.subscribe("JOURNALS_RELOADED", (journalList) => {
    console.log("[Sidebar] journals reloaded");
    updateList(journalList);
  });

  return {
    id: "sidebar",
    renderable: sidebar,
    keyHandlers: new Map([
      // [
      //   "ctrl+b",
      //   (key: KeyEvent) => {
      //     hideSidebar();
      //     return true;
      //   }
      // ]
    ]),
    onEnter: async () => {
      console.log("[Sidebar] loading journals");
      updateBorderColor(true);
      selectComponent.focus();
      const unsubReload = store.subscribe("JOURNALS_RELOADED", (index) => {
        console.log("[Sidebar] journals reloaded");
        updateList(index);
      });


      const journals = await service.listJournals();
      updateList(journals);

      unsubscribers = [unsubReload];
    },

    onLeave: () => {
      console.log("[Sidebar] leaving");
      updateBorderColor(false);
      unsubscribers.forEach((unsub) => unsub());
      unsubscribers = [];
    },
  };
}
