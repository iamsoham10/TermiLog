import {
  BoxRenderable,
  TextRenderable,
  Timeline,
  engine,
  type RenderContext,
} from "@opentui/core";
import type { DashboardStats } from "../dashboardService";

const ANIMATION_DURATION_MS = 600;

export function streakCardComponent(
  renderer: RenderContext,
  getStats: () => DashboardStats,
) {
  let activeTimeline: Timeline | null = null;

  const card = new BoxRenderable(renderer, {
    id: "streak-card",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
    padding: 2,
    backgroundColor: "#1a1a1a",
    border: true,
    borderStyle: "rounded",
    borderColor: "#444444",
    width: "100%",
  });

  const streakNumber = new TextRenderable(renderer, {
    id: "streak-number",
    content: "0",
    fg: "#F5C527",
  });

  const streakLabel = new TextRenderable(renderer, {
    id: "streak-label",
    content: "day streak",
    fg: "#999999",
  });

  card.add(streakNumber);
  card.add(streakLabel);

  function removeTimeline(): void {
    if (activeTimeline) {
      engine.unregister(activeTimeline);
      activeTimeline = null;
    }
  }

  function refresh(): void {
    removeTimeline();
    const { streak } = getStats();

    if (streak === 0) {
      streakNumber.content = "0";
      return;
    }

    const timeline = new Timeline({
      duration: ANIMATION_DURATION_MS,
      autoplay: false,
    });

    timeline.add(
      { value: 0 },
      {
        value: streak,
        duration: ANIMATION_DURATION_MS,
        ease: "outQuad",
        onUpdate: (anim) => {
          streakNumber.content = String(Math.round(anim.targets[0].value));
        },
        onComplete: () => {
          streakNumber.content = String(streak);
        },
      },
    );

    activeTimeline = timeline;
    engine.register(timeline);
    timeline.play();
  }

  function destroy(): void {
    removeTimeline();
  }

  return {
    renderable: card,
    refresh,
    destroy,
  };
}
