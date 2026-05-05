type EventCallback = (...args: any[]) => void;

export class EventEmitter {
  // store listeners in map
  private eventListeners: Map<string, EventCallback[]> = new Map();

  // subscribe to an event - on() will add listeners
  on(eventName: string, callback: EventCallback): void {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }
    this.eventListeners.get(eventName)?.push(callback);
    console.log(
      `[Event Emitter] subscribed to '${eventName}'. Total listeners: ${this.eventListeners.get(eventName)!.length}`,
    );
  }

  // subscribe to an event - returns unsubscribe function
  subscribe(eventName: string, callback: EventCallback): () => void {
    this.on(eventName, callback);
    // unsubscribe function
    return () => {
      this.off(eventName, callback);
    };
  }

  // notify all subscribers - emit() will trigger event
  emit(eventName: string, ...args: any[]): void {
    if (this.eventListeners.has(eventName)) {
      console.log(
        `[Event Emitter] emitting '${eventName}' to ${this.eventListeners.get(eventName)?.length} listeners`,
      );
      this.eventListeners.get(eventName)!.forEach((callback) => {
        try {
          callback(...args);
        } catch (error) {
          console.error(
            `[Event Emitter] error in callback for '${eventName}':`,
            error,
          );
        }
      });
    }
  }

  // unsubscribe from an event - off() will remove listeners
  off(eventName: string, callback: EventCallback): void {
    if (!this.eventListeners.has(eventName)) {
      return;
    }
    const callbacks = this.eventListeners.get(eventName)!;
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
      console.log(`[Event Emitter] unsubscribed from '${eventName}'`);
    }
    // remove event if no listeners available
    if (callbacks.length === 0) {
      this.eventListeners.delete(eventName);
      console.log(`[Event Emitter] removed empty event '${eventName}'`);
    }
  }

  // remove all listeners for an event or remove all events (cleanup)
  removeAllListeners(eventName?: string): void {
    if (eventName) {
      if (this.eventListeners.has(eventName)) {
        this.eventListeners.delete(eventName);
        console.log(`[Event Emitter] removed all listeners for '${eventName}'`);
      }
    } else {
      this.eventListeners.clear();
    }
  }
}
