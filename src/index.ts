import {
  ConsolePosition,
  createCliRenderer,
  // DebugOverlayCorner,
} from "@opentui/core";
import { Router } from "./router";
import { createHomePage } from "./pages/home";
import { createJournalPage } from "./pages/journals";
import { ToasterRenderable } from "@opentui-ui/toast";
import { reconcileOnStartup } from "./indexSync";
import { EMOJI_ICONS } from "@opentui-ui/toast";

const renderer = await createCliRenderer({
  exitOnCtrlC: true,
  consoleOptions: {
    startInDebugMode: true,
    position: ConsolePosition.BOTTOM,
    sizePercent: 30,
  },
  useMouse: true,
});

await reconcileOnStartup();

// add toaster
const toaster = new ToasterRenderable(renderer, {
  position: "top-right",
  icons: EMOJI_ICONS,
});

renderer.root.add(toaster);

// renderer.debugOverlay = {
//   enabled: true,
//   corner: DebugOverlayCorner.topRight,
// };
const router = new Router();

const pageList = [{ create: createHomePage }, { create: createJournalPage }];

for (const pages of pageList) {
  const page = pages.create(renderer);
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
  if (key.name === "h") router.navigate("home");
  if (key.name === "j" && activePage?.id !== "journal")
    router.navigate("journal");
  const focused = renderer.root.focused;
  if (key.name === "q" && !focused) renderer.destroy();
});
