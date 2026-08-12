import { BoxRenderable, TextRenderable, type RenderContext } from "@opentui/core";
import type { Store } from "../store/store";
import type { ComponentDefinition } from "../focusManager";

type InfoParam = {
  label: string;
  info: string;
}

type InfoParamNode = {
  id: string;
  node: TextRenderable;
}

/*
  accept journal metadata as parameter
  handle empty/missing mood or other properties
  manage error & loading state
  manage how state updated when the new journal is opened in editor
*/
export function journalInfoComponent(renderer: RenderContext, store: Store): ComponentDefinition {
  let currentInfoParams: InfoParamNode[] = [];
  const journalInfoBar = new BoxRenderable(renderer,
    {
      id: "info-bar",
      height: 1,
      width: "auto",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: 2,
      paddingRight: 2,
    },
  );

  function createInfoText(param: InfoParam, index: number): InfoParamNode {
    const id = `infoParam-${index}`
    return {
      id,
      node: new TextRenderable(renderer, {
        content: `${param.label}: ${param.info}`,
        fg: "#F5C527"
      })
    }
  }

  function setInfoParam(params: InfoParam[]) {
    if (currentInfoParams.length != 0) {
      for (const child of currentInfoParams) {
        journalInfoBar.remove(child.id);
        child.node.destroy();
      }
    }
    currentInfoParams = params.map((param: InfoParam, index: number) =>
      createInfoText(param, index),
    );
    for (const child of currentInfoParams) {
      journalInfoBar.add(child.node);
    }
  }


  store.subscribe("JOURNAL_LOADED", (payload) => {
    const date = payload.createdAt.toLocaleString();
    setInfoParam([
      { label: "Mood", info: payload.mood || "-" },
      { label: "Written", info: date },
      { label: "Edited", info: payload.updatedAt },
    ]);
  });

  setInfoParam([{ label: "Mood", info: "-" }, { label: "Written", info: "-" }, { label: "Edited", info: "-" }])

  return {
    id: "info-bar",
    renderable: journalInfoBar,
    onEnter: () => {
      console.log("[Infobar] entered");
    },
    onLeave: () => {
      console.log("[Infobar] closed");
    }
  };
}
