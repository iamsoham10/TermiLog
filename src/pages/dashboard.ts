import {
  Box,
  BoxRenderable,
  instantiate,
  Text,
  type RenderContext,
} from "@opentui/core";
import type { Page } from "../types/page";
import { BaseLayout } from "../components/layout";
import { footerComponent } from "../components/footer";
import { streakCardComponent } from "../components/streakCard";
import { activityHeatmapComponent } from "../components/activityHeatmap";
import { moodGraphComponent } from "../components/moodGraph";
import { getDashboardStats, type MoodRangeDays } from "../dashboardService";
import { computeVisibleWeeks } from "../utils/activityLayout";
import type { Store } from "../store/store";

const SIDE_BY_SIDE_BREAKPOINT = 80;

export function createDashboardPage(
  renderer: RenderContext,
  store: Store,
): Page {
  const footer = footerComponent(renderer, store, { mode: "dashboard" });
  let moodDays: MoodRangeDays = 7;

  const getStats = (
    weeks = computeVisibleWeeks(renderer.width),
    days: MoodRangeDays = moodDays,
  ) => getDashboardStats(store.getState().journals, weeks, days);

  const streakCard = streakCardComponent(renderer, getStats);
  const activityHeatmap = activityHeatmapComponent(
    renderer,
    (weeks) => getStats(weeks).activity,
  );
  const moodGraph = moodGraphComponent(
    renderer,
    (days) => getStats(computeVisibleWeeks(renderer.width), days).mood,
  );

  const chartsRow = new BoxRenderable(renderer, {
    id: "dashboard-charts-row",
    width: "100%",
    flexGrow: 1,
    gap: 2,
    flexDirection:
      renderer.width >= SIDE_BY_SIDE_BREAKPOINT ? "row" : "column",
  });
  chartsRow.add(activityHeatmap.renderable);
  chartsRow.add(moodGraph.renderable);

  let layoutResizeRegistered = false;

  function updateChartsLayout(): void {
    chartsRow.flexDirection =
      renderer.width >= SIDE_BY_SIDE_BREAKPOINT ? "row" : "column";
  }

  function ensureLayoutResizeListener(): void {
    if (!layoutResizeRegistered) {
      renderer.on("resize", updateChartsLayout);
      layoutResizeRegistered = true;
    }
  }

  function removeLayoutResizeListener(): void {
    if (layoutResizeRegistered) {
      renderer.off("resize", updateChartsLayout);
      layoutResizeRegistered = false;
    }
  }

  const content = Box(
    {
      id: "dashboard-content",
      flexDirection: "column",
      flexGrow: 1,
      gap: 2,
      padding: 2,
      backgroundColor: "#1a1a1a",
    },
    Text({
      id: "dashboard-title",
      content: "Dashboard",
      fg: "#F5C527",
    }),
    streakCard.renderable,
    chartsRow,
  );

  const page = instantiate(
    renderer,
    BaseLayout(content, footer.renderable, { border: false }),
  );

  return {
    id: "dashboard",
    renderable: page,
    onEnter() {
      footer.onEnter?.();
      ensureLayoutResizeListener();
      updateChartsLayout();
      streakCard.refresh();
      activityHeatmap.refresh({ animate: true });
      moodGraph.refresh({ days: moodDays });
    },
    onLeave() {
      removeLayoutResizeListener();
      streakCard.destroy();
      activityHeatmap.destroy();
      moodGraph.destroy();
      footer.onLeave?.();
    },
    onKeypress(key) {
      if (key.name === "w") {
        moodDays = 7;
        moodGraph.refresh({ days: moodDays });
        return true;
      }
      if (key.name === "m") {
        moodDays = 30;
        moodGraph.refresh({ days: moodDays });
        return true;
      }
      if (key.name === "r") {
        streakCard.refresh();
        activityHeatmap.refresh({ animate: true });
        moodGraph.refresh({ days: moodDays });
        return true;
      }
      return false;
    },
  };
}
