import { getQueryParam } from './utils.js';
import { getAlgorithmYaml, fetchTrainingDatasets } from './api.js';
import { fillContent } from './dom_utils.js';

// Function to populate a table (event or sample results) with metrics and dataset values
function populateTable(tableBody, algorithmData, datasets, trainingDatasets, metrics, metricTitles, resultType) {
    metrics.forEach((metric, metricIndex) => {
        const row = document.createElement('tr');

        row.innerHTML = `<td>${metricTitles[metricIndex]}</td>`; // Metric name as the first cell

        datasets.forEach(dataset => {
            const isTraining = trainingDatasets && trainingDatasets.includes(dataset);
            // Get the value for the metric from the appropriate section (event_results or sample_results)
            let value = algorithmData[dataset][resultType][metric];

            // If the metric is sensitivity, precision, or f1, convert to percentage and round
            if (['sensitivity', 'precision', 'f1'].includes(metric)) {
                value = (value * 100).toFixed(2); // Convert to percentage and round to 2 decimals
            } else {
                value = Math.round(value); // Round values like fpRate
            }

            row.innerHTML += `<td>${isTraining ? '🚂' : value}</td>`; // Add value as a table cell
        });

        tableBody.appendChild(row); // Append the row to the table body
    });
}

// Function to fetch the results JSON and populate the tables
async function loadResults() {
    const algorithm = getQueryParam('algo'); // Get algorithm from URL parameter

    if (!algorithm) {
        return;
    }

    try {
        // Fetch results.json file
        const response = await fetch('/results.json');
        if (!response.ok) {
            throw new Error("Failed to load results.json.");
        }

        const data = await response.json();

        // Check if the algorithm exists in the data
        if (!(algorithm in data)) {
            alert(`Algorithm "${algorithm}" not found in results.json.`);
            return;
        }

        const algorithmData = data[algorithm]; // Get the algorithm data
        const datasets = Object.keys(algorithmData); // Get the datasets for this algorithm
        const trainingDatasets = await fetchTrainingDatasets(algorithm);

        // Update table headers dynamically with dataset names
        const eventHeader = document.getElementById('event-table-header');
        const sampleHeader = document.getElementById('sample-table-header');

        // Empty header for metrics
        eventHeader.innerHTML = '<th></th>';
        sampleHeader.innerHTML = '<th></th>';

        // Create header cells for each dataset in both tables
        datasets.forEach(dataset => {
            eventHeader.innerHTML += `<th>${dataset}</th>`;
            sampleHeader.innerHTML += `<th>${dataset}</th>`;
        });

        // Get the list of metrics
        const metrics = ['sensitivity', 'precision', 'f1', 'fpRate'];
        const metricTitles = ['Sensitivity (%)', 'Precision (%)', 'F1 (%)', 'False Positives per Day'];
        // Populate the tables using the reusable function
        populateTable(document.getElementById('event-table-body'), algorithmData, datasets, trainingDatasets, metrics, metricTitles, 'event_results');
        populateTable(document.getElementById('sample-table-body'), algorithmData, datasets, trainingDatasets, metrics, metricTitles, 'sample_results');

    } catch (error) {
        console.error("Error loading or processing results:", error);
    }
}

// Main function to load all data and populate the page
async function main() {
    const yamlData = await getAlgorithmYaml();
    if (yamlData) {
        fillContent(yamlData);
    }

    loadResults();
}

// Call the main function when the page is loaded
document.addEventListener('DOMContentLoaded', main);
