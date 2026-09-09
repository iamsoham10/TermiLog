import {
  BoxRenderable,
  TextRenderable,
  Timeline,
  engine,
  type RenderContext,
} from "@opentui/core";
import type { ActivityGrid, ActivityLevel } from "../dashboardService";
import { computeVisibleWeeks } from "../utils/activityLayout";

const DAYS = 7;
const COLUMN_STAGGER_MS = 25;

const LEVEL_COLORS: Record<ActivityLevel, string> = {
  0: "#212121",
  1: "#163a2a",
  2: "#1a5c34",
  3: "#238636",
  4: "#2ea043",
};

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

type RefreshOptions = {
  animate?: boolean;
};

function createLegendCell(
  renderer: RenderContext,
  id: string,
  color: string,
): BoxRenderable {
  return new BoxRenderable(renderer, {
    id,
    width: 1,
    height: 1,
    backgroundColor: color,
  });
}

export function activityHeatmapComponent(
  renderer: RenderContext,
  getActivity: (weeks: number) => ActivityGrid,
) {
  let activeTimeline: Timeline | null = null;
  let currentWeeks = 0;
  let resizeRegistered = false;
  const cellRenderables: BoxRenderable[][] = [];
  const weekColumnRenderables: BoxRenderable[] = [];

  const card = new BoxRenderable(renderer, {
    id: "activity-heatmap",
    flexDirection: "column",
    flexGrow: 1,
    gap: 1,
    padding: 2,
    backgroundColor: "#1a1a1a",
    border: true,
    borderStyle: "rounded",
    borderColor: "#444444",
    width: "100%",
  });

  card.add(
    new TextRenderable(renderer, {
      id: "activity-title",
      content: "Activity",
      fg: "#999999",
    }),
  );

  const subtitle = new TextRenderable(renderer, {
    id: "activity-subtitle",
    content: "last 10 weeks",
    fg: "#555555",
  });
  card.add(subtitle);

  const gridCenter = new BoxRenderable(renderer, {
    id: "activity-grid-center",
    width: "100%",
    paddingTop: 1,
    paddingBottom: 1,
  });

  const gridPane = new BoxRenderable(renderer, {
    id: "activity-grid-pane",
    flexDirection: "row",
    width: "100%",
    height: "82%",
    gap: 0,
    backgroundColor: "#141414",
    border: true,
    borderStyle: "single",
    borderColor: "#333333",
  });

  const dayLabelColumn = new BoxRenderable(renderer, {
    id: "activity-day-labels",
    flexDirection: "column",
    flexShrink: 0,
    width: 2,
    gap: 0,
    paddingRight: 1,
  });

  for (let row = 0; row < DAYS; row++) {
    dayLabelColumn.add(
      new TextRenderable(renderer, {
        id: `activity-day-label-${row}`,
        content: DAY_LABELS[row] ?? "",
        fg: "#555555",
        width: 1,
        height: 1,
      }),
    );
  }
  gridPane.add(dayLabelColumn);

  const weekColumnsContainer = new BoxRenderable(renderer, {
    id: "activity-week-columns",
    flexDirection: "row",
    flexGrow: 1,
    width: "100%",
    gap: 0,
  });
  gridPane.add(weekColumnsContainer);
  gridCenter.add(gridPane);
  card.add(gridCenter);

  const legendRow = new BoxRenderable(renderer, {
    id: "activity-legend",
    flexDirection: "row",
    gap: 1,
    alignItems: "center",
    justifyContent: "center",
  });

  legendRow.add(
    new TextRenderable(renderer, {
      id: "activity-legend-less",
      content: "Less",
      fg: "#555555",
    }),
  );

  const legendSwatches = new BoxRenderable(renderer, {
    id: "activity-legend-swatches",
    flexDirection: "row",
    gap: 0,
  });

  for (let level = 1; level <= 4; level++) {
    legendSwatches.add(
      createLegendCell(
        renderer,
        `activity-legend-${level}`,
        LEVEL_COLORS[level as ActivityLevel],
      ),
    );
  }
  legendRow.add(legendSwatches);

  legendRow.add(
    new TextRenderable(renderer, {
      id: "activity-legend-more",
      content: "More",
      fg: "#555555",
    }),
  );
  card.add(legendRow);

  function updateSubtitle(weeks: number): void {
    subtitle.content = `last ${weeks} weeks`;
  }

  function destroyGridCells(): void {
    for (const weekColumn of weekColumnRenderables) {
      weekColumnsContainer.remove(weekColumn.id);
      weekColumn.destroy();
    }
    weekColumnRenderables.length = 0;
    cellRenderables.length = 0;
  }

  function buildGrid(weeks: number): void {
    destroyGridCells();

    for (let col = 0; col < weeks; col++) {
      const weekColumn = new BoxRenderable(renderer, {
        id: `activity-week-${col}`,
        flexDirection: "column",
        flexGrow: 1,
        gap: 0,
      });

      const columnCells: BoxRenderable[] = [];
      for (let row = 0; row < DAYS; row++) {
        const cell = new BoxRenderable(renderer, {
          id: `activity-cell-${col}-${row}`,
          width: "100%",
          height: 1,
          backgroundColor: LEVEL_COLORS[0],
        });
        weekColumn.add(cell);
        columnCells.push(cell);
      }

      cellRenderables.push(columnCells);
      weekColumnRenderables.push(weekColumn);
      weekColumnsContainer.add(weekColumn);
    }

    currentWeeks = weeks;
    updateSubtitle(weeks);
  }

  function removeTimeline(): void {
    if (activeTimeline) {
      engine.unregister(activeTimeline);
      activeTimeline = null;
    }
  }

  function setColumnColors(col: number, grid: ActivityGrid): void {
    const column = grid.columns[col];
    if (!column) return;

    for (let row = 0; row < DAYS; row++) {
      const cell = cellRenderables[col]?.[row];
      const level = column[row]?.level ?? 0;
      if (cell) {
        cell.backgroundColor = LEVEL_COLORS[level];
      }
    }
  }

  function resetAllCells(): void {
    for (let col = 0; col < currentWeeks; col++) {
      for (let row = 0; row < DAYS; row++) {
        const cell = cellRenderables[col]?.[row];
        if (cell) {
          cell.backgroundColor = LEVEL_COLORS[0];
        }
      }
    }
  }

  function applyColors(grid: ActivityGrid, animate: boolean): void {
    removeTimeline();
    resetAllCells();

    if (!animate) {
      for (let col = 0; col < grid.weeks; col++) {
        setColumnColors(col, grid);
      }
      return;
    }

    const timeline = new Timeline({ autoplay: false });

    for (let col = 0; col < grid.weeks; col++) {
      const colIndex = col;
      timeline.call(() => {
        setColumnColors(colIndex, grid);
      }, colIndex * COLUMN_STAGGER_MS);
    }

    activeTimeline = timeline;
    engine.register(timeline);
    timeline.play();
  }

  function ensureResizeListener(): void {
    if (!resizeRegistered) {
      renderer.on("resize", onResize);
      resizeRegistered = true;
    }
  }

  function refresh(options: RefreshOptions = {}): void {
    ensureResizeListener();
    const { animate = false } = options;
    const weeks = computeVisibleWeeks(renderer.width);

    if (weeks !== currentWeeks) {
      buildGrid(weeks);
    }

    const grid = getActivity(weeks);
    applyColors(grid, animate);
  }

  const onResize = (): void => {
    refresh({ animate: false });
  };

  function destroy(): void {
    if (resizeRegistered) {
      renderer.off("resize", onResize);
      resizeRegistered = false;
    }
    removeTimeline();
    destroyGridCells();
    currentWeeks = 0;
  }

  return {
    renderable: card,
    refresh,
    destroy,
  };
}
