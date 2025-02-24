type Database= {
    name: string;
}

type Schema= {
    name: string;
    db: Database;
}
type Table= {
    name: string;
    schema: Schema;
    alias?: string;
}
type Column= {
    name: string;
    table: Table;
}

type ColumnLineage= {
    source: Column[];
    target: Column;
}

type TableLineage= {
    source: ColumnLineage[];
    target: Table;
}
