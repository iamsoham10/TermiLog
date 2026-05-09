import mitt from "mitt";

type EventBusWrapper = ReturnType<typeof mitt>;

interface EventBusInstance extends EventBusWrapper {
  subscribe<K extends string>(
    event: K,
    handler: (...args: any[]) => void,
  ): () => void;
}

function createEventBus(): EventBusInstance {
  const bus = mitt() as EventBusInstance;
  bus.subscribe = function (event: string, handler: (...args: any[]) => void) {
    this.on(event, handler);
    return () => {
      this.off(event, handler);
    };
  };
  return bus;
}

export default createEventBus;
