type LineItem = {
  so_line_item_id: number;
  quantity: number;
};

export type PackageOrder = {
  salesorder_id: string;
  package_number: string;
  line_items: LineItem[];
};


export type PackageOrderFields = ["salesorder_id", "package_number", "line_items"]
export type PackageOrderItemsFields = ["so_line_item_id", "quantity"]