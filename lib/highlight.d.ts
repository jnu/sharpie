export declare type SharpieEvent = "select" | "hoverIn" | "hoverOut";
export declare function watch(element: HTMLElement): {
    hoverIn: (handler: Function) => any;
    hoverOut: (handler: Function) => any;
    select: (handler: Function) => any;
};
export declare function unwatch(element: HTMLElement, eventType?: SharpieEvent, handler?: Function): boolean;
export declare function clearSelection(): void;
