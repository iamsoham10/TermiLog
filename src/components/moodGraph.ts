import {
  BoxRenderable,
  TextRenderable,
  type RenderContext,
} from "@opentui/core";
import type { MoodChart, MoodRangeDays } from "../dashboardService";

const CHART_HEIGHT = 5;
const BAR_COLOR = "#888888";
const EMPTY_CELL_COLOR = "#141414";

type RefreshOptions = {
  days?: MoodRangeDays;
};

type ColumnNodes = {
  id: string;
  column: BoxRenderable;
  emoji: TextRenderable;
  barCells: BoxRenderable[];
  label: TextRenderable;
};

export function moodGraphComponent(
  renderer: RenderContext,
  getMood: (days: MoodRangeDays) => MoodChart,
) {
  let currentDays: MoodRangeDays = 7;
  let columns: ColumnNodes[] = [];

  const card = new BoxRenderable(renderer, {
    id: "mood-graph",
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
      id: "mood-title",
      content: "Mood",
      fg: "#999999",
    }),
  );

  const subtitle = new TextRenderable(renderer, {
    id: "mood-subtitle",
    content: "this week",
    fg: "#555555",
  });
  card.add(subtitle);

  const chartPane = new BoxRenderable(renderer, {
    id: "mood-chart-pane",
    width: "100%",
    flexDirection: "column",
    gap: 1,
    padding: 1,
    backgroundColor: "#141414",
    border: true,
    borderStyle: "single",
    borderColor: "#333333",
  });

  const chartArea = new BoxRenderable(renderer, {
    id: "mood-chart-area",
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 0,
  });
  chartPane.add(chartArea);

  chartPane.add(
    new TextRenderable(renderer, {
      id: "mood-y-hint",
      content: "high 😊        low 😡",
      fg: "#555555",
    }),
  );
  card.add(chartPane);

  function updateSubtitle(days: MoodRangeDays): void {
    subtitle.content = days === 7 ? "this week" : "last 30 days";
  }

  function destroyColumns(): void {
    for (const col of columns) {
      chartArea.remove(col.id);
      col.column.destroy();
    }
    columns = [];
  }

  function buildColumns(pointCount: number): void {
    destroyColumns();

    for (let i = 0; i < pointCount; i++) {
      const id = `mood-col-${i}`;
      const column = new BoxRenderable(renderer, {
        id,
        flexDirection: "column",
        flexGrow: 1,
        alignItems: "center",
        gap: 0,
      });

      const emoji = new TextRenderable(renderer, {
        id: `${id}-emoji`,
        content: " ",
        width: 1,
        height: 1,
      });

      const barStack = new BoxRenderable(renderer, {
        id: `${id}-bars`,
        flexDirection: "column",
        justifyContent: "flex-end",
        height: CHART_HEIGHT,
        width: 1,
        gap: 0,
      });

      const barCells: BoxRenderable[] = [];
      for (let row = 0; row < CHART_HEIGHT; row++) {
        const cell = new BoxRenderable(renderer, {
          id: `${id}-bar-${row}`,
          width: 1,
          height: 1,
          backgroundColor: EMPTY_CELL_COLOR,
        });
        barStack.add(cell);
        barCells.push(cell);
      }

      const label = new TextRenderable(renderer, {
        id: `${id}-label`,
        content: " ",
        fg: "#555555",
        width: 1,
        height: 1,
      });

      column.add(emoji);
      column.add(barStack);
      column.add(label);
      chartArea.add(column);

      columns.push({ id, column, emoji, barCells, label });
    }
  }

  function renderChart(chart: MoodChart): void {
    if (columns.length !== chart.points.length) {
      buildColumns(chart.points.length);
    }

    chart.points.forEach((point, index) => {
      const col = columns[index];
      if (!col) return;

      const hasData = point.score !== null && point.emoji !== null;
      col.emoji.content = hasData ? point.emoji! : " ";
      col.label.content = point.label;
      col.label.fg = hasData ? "#777777" : "#444444";

      for (let row = 0; row < CHART_HEIGHT; row++) {
        const cell = col.barCells[row];
        if (!cell) continue;

        const barRowFromBottom = CHART_HEIGHT - row;
        const filled = hasData && point.score! >= barRowFromBottom;
        cell.backgroundColor = filled ? BAR_COLOR : EMPTY_CELL_COLOR;
      }
    });
  }

  function refresh(options: RefreshOptions = {}): void {
    if (options.days !== undefined) {
      currentDays = options.days;
    }

    updateSubtitle(currentDays);
    const chart = getMood(currentDays);
    renderChart(chart);
  }

  function destroy(): void {
    destroyColumns();
    currentDays = 7;
  }

  return {
    renderable: card,
    refresh,
    destroy,
  };
}
