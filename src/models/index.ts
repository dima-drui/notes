export interface Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EntityQueryOptions<T extends Entity> {
  skip?: number; // Number of items to skip (for pagination)
  limit?: number; // Maximum number of items to return
  /**
   * Sorting options: specify fields and their order.
   * Example: { name: 1, createdAt: -1 } for ascending by name and descending by createdAt.
   */
  sortBy?: { [K in keyof T]?: 1 | -1 };

  projection?: Array<keyof T>;
}