
export interface NavMenuLink {
    type: "link";
    path: string;
    name: string;
    collapse?: boolean;
    subEntries?: NavMenuEntry[];
}

export interface NavMenuGroup {
    type: "group";
    name?: string;
    entries: NavMenuEntry[];
}

export type NavMenuEntry = NavMenuLink | NavMenuGroup;
