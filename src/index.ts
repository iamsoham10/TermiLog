import {
  ConsolePosition,
  createCliRenderer,
  DebugOverlayCorner,
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
});
renderer.debugOverlay = {
  enabled: true,
  corner: DebugOverlayCorner.topRight,
};
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

  if (key.name === "q") renderer.destroy();
});

renderer.useConsole = true;
renderer.console.show();

console.log("This appears in the overlay");
console.error("Errors are color-coded red");
console.warn("Warnings appear in yellow");

renderer.keyInput.on("keypress", (key) => {
  // Toggle with backtick key
  if (key.name === "/") {
    renderer.console.toggle();
  }
});
process.stdout.on("resize", () => {
  console.log(`Now: ${renderer.width}x${renderer.height}`);
  renderer.requestRender();
});

renderer.on("error", () => renderer.console.show());
