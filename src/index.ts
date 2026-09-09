import {
  ConsolePosition,
  createCliRenderer,
  engine,
} from "@opentui/core";
import { Router } from "./router";
import { createHomePage } from "./pages/home";
import { createJournalPage } from "./pages/journals";
import { createDashboardPage } from "./pages/dashboard";
import { ToasterRenderable, toast, EMOJI_ICONS } from "@opentui-ui/toast";
import { reconcileOnStartup } from "./indexSync";
import { createStore } from "./store/store";
import { createJournalService } from "./journalService";
import { storage } from "./journalStorage";
import { shouldDeferToTextInput } from "./utils/keyboardUtils.ts";


async function main() {
  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
    consoleOptions: {
      startInDebugMode: false,
      position: ConsolePosition.BOTTOM,
      sizePercent: 30,
    },
    useMouse: true,
  });

  const store = createStore();
  console.log("[App] Store created");

  const service = createJournalService({ store, storage });
  console.log("[App] Service created");

  const toaster = new ToasterRenderable(renderer, {
    position: "top-right",
    icons: EMOJI_ICONS,
  });
  renderer.root.add(toaster);

  store.subscribe("SAVE_ERROR", (message) => {
    toast.error(message);
  });

  const reconcileResult = await reconcileOnStartup(store);
  if (!reconcileResult.success) {
    toast.error(reconcileResult.message);
  }
  console.log("[App] Index reconciled");

  engine.attach(renderer);

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
    {
      id: "dashboard",
      create: () => createDashboardPage(renderer, store),
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
    const pageHandled = activePage?.onKeypress?.(key) ?? false;
    if (pageHandled) return;
    if (shouldDeferToTextInput(renderer, key)) return;

    if (key.name === "/") {
      renderer.console.toggle();
    }
    if (key.name === "j" && activePage?.id !== "journal") {
      router.navigate("journal");
    }
    if (key.name === "d" && activePage?.id !== "dashboard") {
      router.navigate("dashboard");
    }
    if (key.name === "q") {
      renderer.destroy();
    }
  });

  console.log("[App] ready");
}

main().catch(console.error);
