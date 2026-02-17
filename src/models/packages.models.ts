type LineItem = {
  so_line_item_id: number;
  quantity: number;
};

export type PackageOrder = {
  salesorder_id: string;
  package_number: string;
  date: string
  line_items: LineItem[];
};


export type PackageOrderFields = ["salesorder_id", "line_items", "date"]
export type PackageOrderItemsFields = ["so_line_item_id", "quantity"]