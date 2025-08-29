import { getQueryParam } from './utils.js';
import { getAlgorithmYaml } from './api.js';
import { fillContent } from './dom_utils.js';

// Function to populate a table (event or sample results) with metrics and dataset values
function populateTable(tableBody, algorithmData, metrics, metricTitles, resultType) {
    const row = document.createElement('tr');
    metrics.forEach((metric, metricIndex) => {
        // Get the value for the metric from the appropriate section (event_results or sample_results)
        let value = algorithmData['evaluation_dataset'][resultType][metric];

        // If the metric is sensitivity, precision, or f1, convert to percentage and round
        if (['sensitivity', 'precision', 'f1'].includes(metric)) {
            value = (value * 100).toFixed(2); // Convert to percentage and round to 2 decimals
        } else {
            value = Math.round(value); // Round values like fpRate
        }

        const curCell = row.insertCell();
        curCell.innerHTML = `${value}`;
        curCell.style = `text-align: center;`;
    });
    tableBody.appendChild(row); // Append the row to the table body
}

// Function to fetch the results JSON and populate the tables
async function loadResults() {
    const algorithm = getQueryParam('algo'); // Get algorithm from URL parameter

    if (!algorithm) {
        return;
    }

    try {
        // Fetch results.json file
        const response = await fetch('/challenge_results.json');
        if (!response.ok) {
            throw new Error("Failed to load results.json.");
        }

        const data = await response.json();

        // Check if the algorithm exists in the data
        if (!(algorithm in data)) {
            alert(`Algorithm "${algorithm}" not found in challenge_results.json.`);
            return;
        }

        const algorithmData = data[algorithm]; // Get the algorithm data

        // Update table headers dynamically with dataset names
        const eventHeader = document.getElementById('event-table-header');
        const sampleHeader = document.getElementById('sample-table-header');

        // Get the list of metrics
        const metrics = ['f1', 'sensitivity', 'precision', 'fpRate'];
        const metricTitles = ['F1 (%)', 'Sensitivity (%)', 'Precision (%)', 'False Positives per Day'];

        metricTitles.forEach(metricTitle => {
            eventHeader.innerHTML += `<th>${metricTitle}</th>`;
            sampleHeader.innerHTML += `<th>${metricTitle}</th>`;
        });

        // Populate the tables using the reusable function
        populateTable(document.getElementById('event-table-body'), algorithmData, metrics, metricTitles, 'event_results');
        populateTable(document.getElementById('sample-table-body'), algorithmData, metrics, metricTitles, 'sample_results');

    } catch (error) {
        console.error("Error loading or processing results:", error);
    }
}

async function main() {
    const yamlData = await getAlgorithmYaml(true);
    if (yamlData) {
        fillContent(yamlData, true);
    }
    loadResults();
}

// Call the function to load and populate the results when the page is loaded
document.addEventListener('DOMContentLoaded', main);
