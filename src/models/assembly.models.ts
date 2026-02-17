
export type Assembly = {
    composite_item_id: string;
    composite_item_name: string;
    description: string;
    warehouse_id: string;
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
    warehouse_id: string;
}

export type AssemblyKeys = ["composite_item_id", "composite_item_name", "description", "date", "quantity_to_bundle", "line_items", "is_complete", "warehouse_id"];
export type AssemblyLineItemKeys = ["item_id", "name", "quantity_consumed", "unit", "warehouse_id"];