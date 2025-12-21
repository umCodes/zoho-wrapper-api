
export type Assembly = {
    composite_item_id: string;
    composite_item_name: string;
    description: string;
    refrence_number: string;
    date: string;
    quantity_to_bundle: number;
    line_items: LineItem[];
    is_complete: true;
}


type LineItem = {
    item_id: string;
    name: string;
    quantity_consumed: number;
    unit: string;
    account_id: string;
    location_id: string;
}

export type AssemblyKeys = ["composite_item_id", "composite_item_name", "description", "refrence_number", "date", "quantity_to_bundle", "line_items", "is_complete"];
export type LineItemKeys = ["item_id", "name", "quantity_consumed", "unit", "account_id", "location_id"];