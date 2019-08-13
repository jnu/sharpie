export declare type SharpieEvent = "click" | "deselect" | "select" | "hoverIn" | "hoverOut";
export declare function watch(element: HTMLElement): {
    click: (handler: Function) => any;
    hoverIn: (handler: Function) => any;
    hoverOut: (handler: Function) => any;
    select: (handler: Function) => any;
    deselect: (handler: Function) => any;
};
export declare function unwatch(element: HTMLElement, eventType?: SharpieEvent, handler?: Function): boolean;
export declare function clearSelection(): void;
