

export type SalesOrder = {
    customer_id: string;
    line_items: SalesOrderLineItem[]
}

type SalesOrderLineItem = {
    item_id: string;
    quantity: number;
}

export type SalesOrderKeys = ["customer_id", "line_items"];
export type SalesOrderLineItemKeys = ["item_id", "quantity"];