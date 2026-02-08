import {
  ASCIIFont,
  Box,
  createCliRenderer,
  Text,
  TextAttributes,
  TextRenderable,
} from "@opentui/core";
import { Router } from "./router";
import { createHomePage } from "./pages/home";
import { createJournalPage } from "./pages/journals";

const renderer = await createCliRenderer({ exitOnCtrlC: true });
const router = new Router();

const home = createHomePage(renderer);
const journal = createJournalPage(renderer);

router.register(home);
router.register(journal);

renderer.root.add(home.renderable);
renderer.root.add(journal.renderable);

router.navigate("home");

renderer.keyInput.on("keypress", (key) => {
  const active = router.getActive();
  if (active?.onKeypress?.(key)) return;

  if (key.name === "j") router.navigate("journal");
});
