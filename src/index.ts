import {
  ConsolePosition,
  createCliRenderer,
  // DebugOverlayCorner,
} from "@opentui/core";
import { Router } from "./router";
import { createHomePage } from "./pages/home";
import { createJournalPage } from "./pages/journals";

const renderer = await createCliRenderer({
  exitOnCtrlC: true,
  consoleOptions: {
    startInDebugMode: true,
    position: ConsolePosition.BOTTOM,
    sizePercent: 30,
  },
  useMouse: true,
});

// renderer.debugOverlay = {
//   enabled: true,
//   corner: DebugOverlayCorner.topRight,
// };
const router = new Router();

const home = createHomePage(renderer);
const journal = createJournalPage(renderer);

router.register(home);
router.register(journal);

renderer.root.add(home.renderable);
renderer.root.add(journal.renderable);

router.navigate("home");

renderer.keyInput.on("keypress", (key) => {
  const activePage = router.getActivePage();
  if (activePage?.onKeypress?.(key)) return;

  if (key.name === "j") router.navigate("journal");
  const focused = renderer.root.focused;
  if (key.name === "q" && !focused) renderer.destroy();
});

console.log("This appears in the overlay");
console.error("Errors are color-coded red");
console.warn("Warnings appear in yellow");

renderer.keyInput.on("keypress", (key) => {
  // Toggle with backtick key
  if (key.name === "/") {
    renderer.console.toggle();
  }
});
