export type Item = {
    name: string;
    description: string;
    unit: string;
    rate: number;
    purchase_rate: number;
    product_type: "goods";
    inventory_account_id: string;
    location: location;
}

type location = {
    location_id: string;
    initial_stock: number;
}
export type ItemKeys = ["name", "description", "unit", "rate", "purchase_rate", "product_type", "inventory_account_id", "location"];
export type LocationKeys = ["location_id", "initial_stock"];

export type CompositeItem = {
    name: string;
    description: string;
    mapped_items: MappedItem[];
    item_type: "inventory";
    unit: string;
    sku: string;
    rate: number;
    product_type: "goods";
    inventory_account_id: string;
}

export type CompositeItemKeys = ["name", "description", "mapped_items", "item_type", "unit", "sku", "rate", "product_type", "inventory_account_id"];
export type MappedItemKeys = ["item_id", "quantity"];

type MappedItem = {
    item_id: string;
    quantity: number;
}
