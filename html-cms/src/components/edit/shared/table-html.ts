export interface TableCellModel {
    tagName: 'td' | 'th';
    content: string;
    styles: Record<string, string>;
}

export interface TableModel {
    className: string;
    tableStyles: Record<string, string>;
    rows: TableCellModel[][];
    headerRowCount: number;
}

function roundPx(value: number): string {
    return `${Math.round(value)}px`;
}

function parseStyleText(styleText: string): Record<string, string> {
    const styles: Record<string, string> = {};
    styleText
        .split(';')
        .map((chunk) => chunk.trim())
        .filter(Boolean)
        .forEach((chunk) => {
            const idx = chunk.indexOf(':');
            if (idx === -1) return;
            const key = chunk.slice(0, idx).trim().toLowerCase();
            const value = chunk.slice(idx + 1).trim();
            if (key) styles[key] = value;
        });
    return styles;
}

function stringifyStyleRecord(styles: Record<string, string>): string {
    return Object.entries(styles)
        .filter(([, value]) => value.trim() !== '')
        .map(([key, value]) => `${key}:${value}`)
        .join(';');
}

function cloneCell(cell: TableCellModel): TableCellModel {
    return {
        tagName: cell.tagName,
        content: cell.content,
        styles: { ...cell.styles },
    };
}

function defaultCell(tagName: 'td' | 'th' = 'td'): TableCellModel {
    return {
        tagName,
        content: '<br>',
        styles: {
            'vertical-align': 'top',
        },
    };
}

export function createDefaultTableModel(rowCount = 2, columnCount = 2): TableModel {
    const rows = Array.from({ length: rowCount }, (_, rowIdx) =>
        Array.from({ length: columnCount }, () => defaultCell(rowIdx === 0 ? 'th' : 'td')),
    );

    return {
        className: 'default',
        tableStyles: {
            'border-collapse': 'collapse',
            width: '100%',
        },
        rows,
        headerRowCount: Math.min(1, rowCount),
    };
}

export function parseFirstTableFromHtml(html: string): TableModel | null {
    if (!html.trim()) return null;

    const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
    const table = doc.querySelector('table');
    if (!table) return null;

    const headerRows = Array.from(table.querySelectorAll(':scope > thead > tr'));
    const bodyRows = Array.from(table.querySelectorAll(':scope > tbody > tr'));
    const looseRows = Array.from(table.querySelectorAll(':scope > tr'));
    const sourceRows = headerRows.length || bodyRows.length ? [...headerRows, ...bodyRows] : looseRows;

    const maxCols = Math.max(1, ...sourceRows.map((row) => row.querySelectorAll(':scope > th, :scope > td').length));
    const rows = sourceRows.map((row, rowIdx) => {
        const cells = Array.from(row.querySelectorAll(':scope > th, :scope > td')).map((cell) => ({
            tagName: cell.tagName.toLowerCase() === 'th' ? 'th' : 'td',
            content: cell.innerHTML || '<br>',
            styles: parseStyleText(cell.getAttribute('style') ?? ''),
        })) satisfies TableCellModel[];

        while (cells.length < maxCols) {
            cells.push(defaultCell(rowIdx < headerRows.length ? 'th' : 'td'));
        }

        return cells;
    });

    return {
        className: table.className,
        tableStyles: parseStyleText(table.getAttribute('style') ?? ''),
        rows: rows.length > 0 ? rows : createDefaultTableModel().rows,
        headerRowCount: headerRows.length > 0 ? headerRows.length : 0,
    };
}

export function hydrateTableModelSizing(model: TableModel, tableEl?: HTMLTableElement | null): TableModel {
    const nextRows = model.rows.map((row) => row.map(cloneCell));
    const columnCount = nextRows[0]?.length ?? 0;
    const liveRows = tableEl ? Array.from(tableEl.querySelectorAll('tr')) : [];

    for (let colIdx = 0; colIdx < columnCount; colIdx++) {
        const hasWidth = nextRows.some((row) => !!row[colIdx]?.styles.width?.trim());
        if (hasWidth) continue;

        let widthValue = '';
        if (tableEl) {
            const liveCell = liveRows[0]?.querySelectorAll('th,td')[colIdx] as HTMLElement | undefined;
            const width = liveCell?.getBoundingClientRect().width ?? 0;
            if (width > 0) widthValue = roundPx(width);
        }
        if (!widthValue && columnCount > 0) {
            widthValue = `${(100 / columnCount).toFixed(2)}%`;
        }
        if (widthValue) {
            nextRows.forEach((row) => {
                if (row[colIdx]) row[colIdx].styles.width = widthValue;
            });
        }
    }

    nextRows.forEach((row, rowIdx) => {
        const hasHeight = row.some((cell) => !!cell.styles.height?.trim());
        if (hasHeight) return;

        let heightValue = '';
        if (tableEl) {
            const liveRow = liveRows[rowIdx] as HTMLElement | undefined;
            const height = liveRow?.getBoundingClientRect().height ?? 0;
            if (height > 0) heightValue = roundPx(height);
        }
        if (!heightValue) {
            heightValue = '44px';
        }
        row.forEach((cell) => {
            cell.styles.height = heightValue;
        });
    });

    return {
        ...model,
        rows: nextRows,
    };
}

export function buildTableHtml(model: TableModel): string {
    const tableStyles = stringifyStyleRecord({
        'border-collapse': 'collapse',
        width: '100%',
        ...model.tableStyles,
    });

    const renderRow = (cells: TableCellModel[]) =>
        `<tr>${cells
            .map((cell) => {
                const tagName = cell.tagName === 'th' ? 'th' : 'td';
                const style = stringifyStyleRecord(cell.styles);
                const styleAttr = style ? ` style="${style}"` : '';
                return `<${tagName}${styleAttr}>${cell.content || '<br>'}</${tagName}>`;
            })
            .join('')}</tr>`;

    const headerRows = model.rows.slice(0, model.headerRowCount);
    const bodyRows = model.rows.slice(model.headerRowCount);
    const classAttr = model.className.trim() ? ` class="${model.className.trim()}"` : '';

    return (
        `<table${classAttr} style="${tableStyles}">` +
        (headerRows.length > 0 ? `<thead>${headerRows.map(renderRow).join('')}</thead>` : '') +
        `<tbody>${(bodyRows.length > 0 ? bodyRows : model.rows.slice(model.headerRowCount)).map(renderRow).join('')}</tbody>` +
        `</table>`
    );
}

export function replaceFirstTableInHtml(contentHtml: string, tableHtml: string): string {
    const wrapperHtml = contentHtml.trim() || '<p style="margin:0;"><br></p>';
    const doc = new DOMParser().parseFromString(`<div id="spw-root">${wrapperHtml}</div>`, 'text/html');
    const root = doc.getElementById('spw-root');
    if (!root) return tableHtml;

    const existingTable = root.querySelector('table');
    if (existingTable) {
        existingTable.outerHTML = tableHtml;
        return root.innerHTML;
    }

    root.insertAdjacentHTML('beforeend', tableHtml);
    return root.innerHTML;
}

export function updateCellStyle(
    model: TableModel,
    rowIndex: number,
    columnIndex: number,
    styleKey: string,
    value: string,
): TableModel {
    const nextRows = model.rows.map((row, rIdx) =>
        row.map((cell, cIdx) => {
            if (rIdx !== rowIndex || cIdx !== columnIndex) return cell;
            const nextStyles = { ...cell.styles };
            if (value.trim()) nextStyles[styleKey] = value.trim();
            else delete nextStyles[styleKey];
            return { ...cell, styles: nextStyles };
        }),
    );

    return { ...model, rows: nextRows };
}

export function updateColumnWidth(model: TableModel, columnIndex: number, value: string): TableModel {
    const nextRows = model.rows.map((row) =>
        row.map((cell, cIdx) => {
            if (cIdx !== columnIndex) return cell;
            const nextCell = cloneCell(cell);
            if (value.trim()) nextCell.styles.width = value.trim();
            else delete nextCell.styles.width;
            return nextCell;
        }),
    );
    return { ...model, rows: nextRows };
}

export function updateRowHeight(model: TableModel, rowIndex: number, value: string): TableModel {
    const nextRows = model.rows.map((row, rIdx) =>
        row.map((cell) => {
            if (rIdx !== rowIndex) return cell;
            const nextCell = cloneCell(cell);
            if (value.trim()) nextCell.styles.height = value.trim();
            else delete nextCell.styles.height;
            return nextCell;
        }),
    );
    return { ...model, rows: nextRows };
}

export function addTableRow(model: TableModel): TableModel {
    const columnCount = model.rows[0]?.length ?? 2;
    const nextRow = Array.from({ length: columnCount }, () => defaultCell('td'));
    return {
        ...model,
        rows: [...model.rows.map((row) => row.map(cloneCell)), nextRow],
    };
}

export function addTableColumn(model: TableModel): TableModel {
    const nextRows = model.rows.map((row, rowIdx) => [
        ...row.map(cloneCell),
        defaultCell(rowIdx < model.headerRowCount ? 'th' : 'td'),
    ]);
    return { ...model, rows: nextRows };
}

export function deleteTableRow(model: TableModel, rowIndex: number): TableModel {
    if (model.rows.length <= 1) return model;

    const nextRows = model.rows.filter((_, idx) => idx !== rowIndex).map((row) => row.map(cloneCell));

    const nextHeaderRowCount =
        rowIndex < model.headerRowCount ? Math.max(0, model.headerRowCount - 1) : model.headerRowCount;

    return {
        ...model,
        rows: nextRows.length > 0 ? nextRows : createDefaultTableModel(1, model.rows[0]?.length ?? 2).rows,
        headerRowCount: Math.min(nextHeaderRowCount, nextRows.length),
    };
}

export function deleteTableColumn(model: TableModel, columnIndex: number): TableModel {
    const columnCount = model.rows[0]?.length ?? 0;
    if (columnCount <= 1) return model;

    const nextRows = model.rows.map((row) => row.filter((_, idx) => idx !== columnIndex).map(cloneCell));

    return {
        ...model,
        rows: nextRows,
    };
}

export function getColumnWidth(model: TableModel, columnIndex: number): string {
    for (const row of model.rows) {
        const width = row[columnIndex]?.styles.width?.trim();
        if (width) return width;
    }
    return '';
}

export function getRowHeight(model: TableModel, rowIndex: number): string {
    const row = model.rows[rowIndex];
    if (!row) return '';
    for (const cell of row) {
        const height = cell.styles.height?.trim();
        if (height) return height;
    }
    return '';
}
