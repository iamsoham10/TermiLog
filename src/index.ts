import {
  ConsolePosition,
  createCliRenderer,
  // DebugOverlayCorner,
} from "@opentui/core";
import { Router } from "./router";
import { createHomePage } from "./pages/home";
import { createJournalPage } from "./pages/journals";
import { ToasterRenderable } from "@opentui-ui/toast";

const renderer = await createCliRenderer({
  exitOnCtrlC: true,
  consoleOptions: {
    startInDebugMode: true,
    position: ConsolePosition.BOTTOM,
    sizePercent: 30,
  },
  useMouse: true,
});

// add toaster
const toaster = new ToasterRenderable(renderer, {
  position: "bottom-right",
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
  if (key.name === "j") router.navigate("journal");
  const focused = renderer.root.focused;
  if (key.name === "q" && !focused) renderer.destroy();
});
