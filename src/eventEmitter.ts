type EventCallback = (...args: any[]) => void;

export class EventEmitter {
  // store listeners - {eventName: [callback1, callback2...]}
  private listeners: Map<string, EventCallback[]> = new Map();

  // subscribe to an event - on() will add listeners
  on(eventName: string, callback: EventCallback): void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName)?.push(callback);
  }

  // notify all subscribers - emit() will trigger event
  emit(eventName: string, ...args: any[]): void {
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName)!.forEach((callback) => {
        callback(...args);
      });
    }
  }

  // unsubscribe from an event - off() will remove listeners
  off(eventName: string, callback: EventCallback): void {
    if (this.listeners.has(eventName)) {
      const callbacks = this.listeners.get(eventName)!;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
      if (callbacks.length === 0) {
        this.listeners.delete(eventName);
      }
    }
  }

  // remove all listeners for an event (cleanup)
  removeAllListeners(eventName?: string): void {
    if (eventName) {
      this.listeners.delete(eventName);
    } else {
      this.listeners.clear();
    }
  }
}
