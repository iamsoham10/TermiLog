import {
  ConsolePosition,
  createCliRenderer,
} from "@opentui/core";
import { Router } from "./router";
import { createHomePage } from "./pages/home";
import { createJournalPage } from "./pages/journals";
import { ToasterRenderable } from "@opentui-ui/toast";
import { reconcileOnStartup } from "./indexSync";
import { EMOJI_ICONS } from "@opentui-ui/toast";
import { createStore } from "./store/store";
import { createJournalService } from "./journalService";
import { storage } from "./journalStorage";


async function main() {
  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
    consoleOptions: {
      startInDebugMode: true,
      position: ConsolePosition.BOTTOM,
      sizePercent: 30,
    },
    useMouse: true,
  });

  const store = createStore();
  console.log("[App] Store created");

  const service = createJournalService({ store, storage });
  console.log("[App] Service created");

  await reconcileOnStartup(store);
  console.log("[App] Index reconciled");

  const toaster = new ToasterRenderable(renderer, {
    position: "top-right",
    icons: EMOJI_ICONS,
  });
  renderer.root.add(toaster);

  const router = new Router();
  const pages = [
    {
      id: "home",
      create: () => createHomePage(renderer, store),
    },
    {
      id: "journal",
      create: () => createJournalPage(renderer, store, service),
    },
  ];

  for (const pageConfig of pages) {
    const page = pageConfig.create();
    router.register(page);
    renderer.root.add(page.renderable);
  }
  router.navigate("home");

  renderer.keyInput.on("keypress", (key) => {
    const activePage = router.getActivePage();
    if (activePage?.onKeypress?.(key)) return;

    if (key.name === "/") {
      renderer.console.toggle();
    }
    if (key.name === "j" && activePage?.id !== "journal") {
      router.navigate("journal");
    }
    const focused = renderer.root.focused;
    if (key.name === "q" && !focused) {
      renderer.destroy();
    }
  });

  console.log("[App] ready");
}

main().catch(console.error);
