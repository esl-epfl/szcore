import { createTableCell, createTableCellLink } from './dom_utils.js';
import { getColorForScore } from './color_utils.js';
import { updateMetricSort, updateSampleEventSelect } from './table_utils.js';

// Fetch the bundled results JSON
async function loadResults(events_or_samples) {
    const response = await fetch('/challenge_results.json'); // Path to the bundled JSON file
    const data = await response.json();

    const briefSummaryResponse = await fetch('/brief_summaries.json'); // Path to the bundled JSON file
    const briefSummaries = await briefSummaryResponse.json();

    const algorithms = Object.keys(data);
    const datasets = new Set();
    algorithms.forEach(algorithm => {
        Object.keys(data[algorithm]).forEach(dataset => {
            datasets.add(dataset);
        });
    });

    const metrics = ["f1", "sensitivity", "precision", "fpRate"];
    const metricNames = ["F1-score", "Sensitivity", "Precision", "False Positives"];

    const tableHeaderRow = document.getElementById("table-header");
    const tableBody = document.getElementById("table-body");

    // Add an empty cell in the top-left corner
    tableHeaderRow.appendChild(createTableCell("Algorithms"));

    // Add dataset names as column headers
    metrics.forEach((dataset, i) => {
        const headerCell = createTableCell(metricNames[i]);
        headerCell.classList.add('text-center');
        headerCell.classList.add('w-24');
        tableHeaderRow.appendChild(headerCell);
    });

    // Add a row for each algorithm
    algorithms.forEach(algorithm => {
        const row = document.createElement("tr");

        const briefSummary = briefSummaries[algorithm];
        row.appendChild(createTableCellLink(data[algorithm].algorithm_name, `/challenge_algorithm/?algo=${algorithm}`, briefSummary)); // Add algorithm name as row header

        // Add F1 score for each dataset
        metrics.forEach((metric, i) => {
            let metricScore;
            if (metric === 'fpRate') {
                metricScore = Math.round(data[algorithm].evaluation_dataset[events_or_samples][metric]) ?? ''; // Handle missing data
            } else {
                metricScore = Math.round(data[algorithm].evaluation_dataset[events_or_samples][metric] * 100) ?? ''; // Handle missing data
            }
            const metricCell = createTableCell(metricScore);
            metricCell.classList.add('text-center');
            if ((metricScore !== '') && !(metric === "fpRate")) {
                const color = getColorForScore(metricScore);
                metricCell.style.backgroundColor = color.bgColor;
                metricCell.style.color = color.textColor;
            }

            row.appendChild(metricCell);
        });

        tableBody.appendChild(row);
    });
    updateMetricSort();
}

// Attach event listeners
document.getElementById('metric-sort-select').addEventListener('change', updateMetricSort);
document.getElementById('sample-event-select').addEventListener('change', () => updateSampleEventSelect(loadResults));

// Call the function to load results and populate the table
loadResults('event_results');