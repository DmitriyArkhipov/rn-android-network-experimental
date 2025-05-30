export type EmitterEvent = any;

type EventCallback = (event: EmitterEvent | undefined) => any;
type MapItem = Array<EventCallback>;
type AnyCallback = (value: any) => any;
type Callback = AnyCallback | EventCallback;

export class EmitterClass {
    events: Map<string, MapItem>;

    constructor(events: Array<[string, MapItem]> = []) {
        this.events = new Map(events);
    }

    subscribe(name: string, callback: Callback) {
        const newArray: MapItem = this.events.get(name) || [];

        this.events.set(name, [...newArray, callback]);

        return () => {
            let resultArray = this.events.get(name) || [];
            resultArray = resultArray.filter((item: Callback) => item !== callback);
            this.events.set(name, resultArray);
        };
    }

    emit(name: string, event: EmitterEvent | undefined = undefined): Array<any> {
        const callbackArray = this.events.get(name);

        if (callbackArray) {
            return callbackArray.map((callback: Callback) => callback(event));
        }

        return [];
    }
}

export default new EmitterClass();
