import { fetchShortTitle, fetchTrainingDatasets } from './api.js';
import { createTableCell, createTableCellLink } from './dom_utils.js';
import { getColorForScore } from './color_utils.js';
import { updateMetricSort, updateSampleEventSelect } from './table_utils.js';

// Fetch the bundled results JSON
async function loadResults(events_or_samples) {
    const response = await fetch('/results.json'); // Path to the bundled JSON file
    const data = await response.json();

    const algorithms = Object.keys(data);
    const tableElement = document.getElementById("results");
    const dataset = tableElement.getAttribute("data-source");

    const metrics = ["f1", "sensitivity", "precision", "fpRate"];
    const metricNames = ["F1-score", "Sensitivity", "Precision", "False Positives"];

    const tableHeaderRow = document.getElementById("table-header");
    const tableBody = document.getElementById("table-body");

    // Add an empty cell in the top-left corner
    tableHeaderRow.appendChild(createTableCell("Algorithms"));

    // Add dataset names as column headers
    metrics.forEach((metric, i) => {
        const headerCell = createTableCell(metricNames[i]);
        headerCell.classList.add('text-center');
        headerCell.classList.add('w-24');
        tableHeaderRow.appendChild(headerCell);
    });

    const trainingAlgos = [];

    // Add a row for each algorithm
    for (const algorithm of algorithms) {
        if (dataset in data[algorithm]) {
            const row = document.createElement("tr");

            const shortTitle = await fetchShortTitle(algorithm);
            const trainingDatasets = await fetchTrainingDatasets(algorithm);

            // Track algorithms that trained on this dataset
            if (trainingDatasets && trainingDatasets.includes(dataset)) {
                trainingAlgos.push({ title: shortTitle || algorithm, algorithm });
            }

            row.appendChild(createTableCellLink(shortTitle || algorithm, `/algorithm/?algo=${algorithm}`));

            // Add metric value for each column
            metrics.forEach((metric) => {
                let metricScore = '';
                const raw = data[algorithm][dataset]?.[events_or_samples]?.[metric];
                if (raw !== undefined && !isNaN(raw)) {
                    metricScore = metric === 'fpRate' ? Math.round(raw) : Math.round(raw * 100);
                }
                const metricCell = createTableCell(metricScore);
                metricCell.classList.add('text-center');
                if (metricScore !== '' && metric !== 'fpRate') {
                    const color = getColorForScore(metricScore);
                    metricCell.style.backgroundColor = color.bgColor;
                    metricCell.style.color = color.textColor;
                }

                row.appendChild(metricCell);
            });

            tableBody.appendChild(row);
        }
    }
    updateMetricSort();

    // Render training algorithms section if any
    if (trainingAlgos.length > 0) {
        const section = document.getElementById('training-algos-section');
        const list = document.getElementById('training-algos');
        trainingAlgos.forEach(({ title, algorithm }) => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="/algorithm/?algo=${algorithm}">🚂 ${title}</a>`;
            list.appendChild(li);
        });
        section.style.display = 'block';
    }
}

// Attach event listeners
document.getElementById('metric-sort-select').addEventListener('change', updateMetricSort);
document.getElementById('sample-event-select').addEventListener('change', () => updateSampleEventSelect(loadResults));


// Call the function to load results and populate the table
loadResults('event_results');