function sortTable(column_number) {
    const table = document.getElementById("table-body");
    let switching = true;
    while (switching) {
        switching = false;
        const rows = table.rows;
        let shouldSwitch = false;
        let i = 0;
        for (i = 0; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            const x = rows[i].getElementsByTagName("TD")[column_number];
            const y = rows[i + 1].getElementsByTagName("TD")[column_number];

            let x_value = 0;
            if (x.innerHTML.toLowerCase() !== "nan") {
                x_value = parseInt(x.innerHTML, 10);
            }
            let y_value = 0;
            if (y.innerHTML.toLowerCase() !== "nan") {
                y_value = parseInt(y.innerHTML, 10);
            }

            if (x_value < y_value) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

export function updateMetricSort() {
    const metricSortSelect = document.getElementById('metric-sort-select').value;
    sortTable(parseInt(metricSortSelect, 10));
}

export function updateSampleEventSelect(loadResultsCallback) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    const tableHead = document.getElementById("table-header");
    tableHead.innerHTML = "";

    const eventSampleSelect = document.getElementById('sample-event-select').value;
    loadResultsCallback(eventSampleSelect);
}
