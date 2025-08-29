// Function to get the query parameter from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to populate a table (event or sample results) with metrics and dataset values
function populateTable(tableBody, algorithmData, datasets, trainingDatasets, metrics, metricTitles, resultType) {
    metrics.forEach((metric, metricIndex) => {
        const row = document.createElement('tr');

        row.innerHTML = `<td>${metricTitles[metricIndex]}</td>`;  // Metric name as the first cell

        datasets.forEach(dataset => {
            const isTraining = trainingDatasets.includes(dataset);
            // Get the value for the metric from the appropriate section (event_results or sample_results)
            let value = algorithmData[dataset][resultType][metric];
            
            // If the metric is sensitivity, precision, or f1, convert to percentage and round
            if (['sensitivity', 'precision', 'f1'].includes(metric)) {
                value = (value * 100).toFixed(2);  // Convert to percentage and round to 2 decimals
            } else {
                value = Math.round(value);  // Round values like fpRate
            }

            row.innerHTML += `<td>${isTraining ? '🚂' : value}</td>`;  // Add value as a table cell
        });

        tableBody.appendChild(row);  // Append the row to the table body
    });
}

// Function to fetch the results JSON and populate the tables
async function loadResults() {
    const algorithm = getQueryParam('algo');  // Get algorithm from URL parameter

    if (!algorithm) {
        alert("Algorithm not specified in the URL.");
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

        const algorithmData = data[algorithm];  // Get the algorithm data
        const datasets = Object.keys(algorithmData);  // Get the datasets for this algorithm
        const trainingDatasets = await fetchTrainingDatasets(algorithm);

        // Update table headers dynamically with dataset names
        const eventHeader = document.getElementById('event-table-header');
        const sampleHeader = document.getElementById('sample-table-header');

        // Empty header for metrics
        eventHeader.innerHTML = `<th></th>`;
        sampleHeader.innerHTML = `<th></th>`;

        // Create header cells for each dataset in both tables
        datasets.forEach(dataset => {
            eventHeader.innerHTML += `<th>${dataset}</th>`;
            sampleHeader.innerHTML += `<th>${dataset}</th>`;
        });

        // Get the list of metrics
        const metrics = ['sensitivity', 'precision', 'f1', 'fpRate'];
        const metricTitles = ['Sensitivity (%)', 'Precision (%)', 'F1 (%)', 'False Positives per Day']
        // Populate the tables using the reusable function
        populateTable(document.getElementById('event-table-body'), algorithmData, datasets, trainingDatasets, metrics, metricTitles, 'event_results');
        populateTable(document.getElementById('sample-table-body'), algorithmData, datasets, trainingDatasets, metrics, metricTitles, 'sample_results');

    } catch (error) {
        console.error("Error loading or processing results:", error);
    }
}

// Function to get the query parameter from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to fetch the YAML file from the server and parse it
async function loadYAML(fileName) {
    try {
        if (!fileName) {
            throw new Error("YAML file name is missing in the URL parameter.");
        }

        // Fetch the YAML file (assuming it's served from the 'algorithms' directory)
        const response = await fetch(`/algorithms/${fileName}.yaml`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const yamlText = await response.text();

        // Parse the YAML content into a JavaScript object
        return jsyaml.load(yamlText);
    } catch (error) {
        // Handle error, maybe return null or an empty object
        console.error("Error loading YAML:", error);
        return null;
    }
}

// Helper function to fetch the training datasets from the YAML file
async function fetchTrainingDatasets(algorithm) {
    try {
        const response = await fetch(`/algorithms/${algorithm}.yaml`);
        if (!response.ok) {
            console.error(`Failed to fetch YAML for algorithm: ${algorithm}`);
            return null;
        }
        const yamlText = await response.text();
        const yamlData = jsyaml.load(yamlText); // Use js-yaml to parse the YAML file
        var datasets = yamlData.datasets || null; // Return the short_title if it exists
        if (datasets) {
            datasets = datasets.map(dataset => {
                if (dataset === 'Physionet CHB-MIT Scalp EEG dataset'){
                    return 'chbmit';
                }
                else if (dataset === 'Physionet Siena Scalp EEG'){
                    return 'siena';
                }
                else if (dataset === 'TUH Seizure Corpus'){
                    return 'tuh';
                }
                else if (dataset === 'KU Leuven SeizeIT1'){
                    return 'seizeit';
                }
                else if (dataset === 'Dianalund Scalp EEG dataset'){
                    return 'dianalund';
                }
                else{
                    return dataset;
                }
            });
        }
        return datasets;
    } catch (error) {
        console.error(`Error fetching or parsing YAML for algorithm: ${algorithm}`, error);
        return null;
    }
}

function formatAuthors(authors) {
    const listItems = authors.map(author => {
        const name = `${author['given_names']} ${author['family_names']}`;
        const orcid = author.orcid ? ` - <a href="${author.orcid}" target="_blank">ORCID</a>` : '';
        return `<li class="author">${name}${orcid}</li>`;
    }).join('');

    return `<ul>${listItems}</ul>`;
}

// Function to format datasets section
function formatDatasets(datasets) {
    const listItems = datasets.map(dataset => {
        return `<li>${dataset}</li>`;
    }).join('');
    return `<ul>${listItems}</ul>`;
}

// Function to fill the content in the HTML page
function fillContent(data) {
    // Update algorithm title and image
    document.getElementById('algorithm-title').innerText = data.title || "No title provided";

    // Update version and release date
    document.getElementById('algorithm-version').innerText = data.version || "N/A";
    document.getElementById('release-date').innerText = data['date_released'] || "N/A";

    // Update abstract section
    document.getElementById('abstract-text').innerText = data.abstract || "No abstract available";

    // Update authors section
    const authorsContent = formatAuthors(data.authors);
    document.getElementById('authors-list').innerHTML = authorsContent;

    // Update dataset section
    const datasetsContent = formatDatasets(data.datasets);
    document.getElementById('datasets-list').innerHTML = datasetsContent;

    // Update repository section
    document.getElementById('repository-url').innerHTML = `<a href="${data.repository}" target="_blank">${data.repository}</a>`;
    document.getElementById('license-text').innerText = data.license || "No license available";
    document.getElementById('algorithm-image').innerHTML = `<a href="https://${data.image}" target="_blank">https://${data.image}</a>`;

}

// Main function to load all data and populate the page
async function main() {
    const yamlFileName = getQueryParam('algo');
    if (!yamlFileName) {
        alert("Algorithm not specified in the URL.");
        return;
    }

    const yamlData = await loadYAML(yamlFileName);
    if (yamlData) {
        // Dynamically update the title of the page with the algorithm title
        document.title = yamlData.title || "Algorithm Description";
        // Fill in the HTML content
        fillContent(yamlData);
    }

    loadResults();
}

// Call the main function when the page is loaded
document.addEventListener('DOMContentLoaded', main);
