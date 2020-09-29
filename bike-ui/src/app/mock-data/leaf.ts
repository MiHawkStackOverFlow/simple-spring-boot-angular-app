export interface Leaf {
    title: string;
    key: string;
    isLeaf?: boolean;
    expanded?: boolean;
    children?: Leaf[];
}
