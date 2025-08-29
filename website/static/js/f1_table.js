import { fetchShortTitle, fetchTrainingDatasets } from './api.js';
import { createTableCell, createTableCellLink } from './dom_utils.js';
import { getColorForScore } from './color_utils.js';

// Fetch the bundled results JSON
async function loadResults() {
    const response = await fetch('/results.json'); // Path to the bundled JSON file
    const data = await response.json();

    const algorithms = Object.keys(data);

    const tableBody = document.getElementById("table-body");
    // Get datasets from the table header row, skipping the first column
    const tableHeaderRow = document.getElementById("table-header");
    const headerCells = tableHeaderRow.querySelectorAll("td");
    const datasets = new Set();
    headerCells.forEach((cell, index) => {
        if (index > 0) { // Skip the first column
            datasets.add(cell.textContent.trim());
        }
    });

    // Add a row for each algorithm
    for (const algorithm of algorithms) {
        const row = document.createElement("tr");

        // Fetch the short_title from the YAML file
        const shortTitle = await fetchShortTitle(algorithm);
        const trainingDatasets = await fetchTrainingDatasets(algorithm);

        // Add short_title as the row header with a link
        row.appendChild(createTableCellLink(shortTitle || algorithm, `/algorithm/?algo=${algorithm}`));

        // Add F1 score for each dataset
        datasets.forEach(dataset => {
            let f1Cell;
            if (!trainingDatasets || !trainingDatasets.includes(dataset)) {
                let f1Score = '';
                if (data[algorithm][dataset]?.event_results?.f1 && !isNaN(data[algorithm][dataset]?.event_results?.f1)) {
                    f1Score = Math.round(data[algorithm][dataset]?.event_results?.f1 * 100) ?? ''; // Handle missing data
                }
                f1Cell = createTableCell(f1Score);
                f1Cell.classList.add('text-center');
                if (f1Score !== '') {
                    const color = getColorForScore(f1Score);
                    f1Cell.style.backgroundColor = color.bgColor;
                    f1Cell.style.color = color.textColor;
                }
            }
            else {
                f1Cell = createTableCell('🚂');
                f1Cell.classList.add('text-center');
            }

            row.appendChild(f1Cell);
        });

        tableBody.appendChild(row);
    }
}

// Call the function to load results and populate the table
loadResults();