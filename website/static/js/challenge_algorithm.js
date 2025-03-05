// Function to get the query parameter from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to populate a table (event or sample results) with metrics and dataset values
function populateTable(tableBody, algorithmData, metrics, metricTitles, resultType) {
    var row = document.createElement('tr');
    metrics.forEach((metric, metricIndex) => {
        // Get the value for the metric from the appropriate section (event_results or sample_results)
        let value = algorithmData['evaluation_dataset'][resultType][metric];
        
        // If the metric is sensitivity, precision, or f1, convert to percentage and round
        if (['sensitivity', 'precision', 'f1'].includes(metric)) {
            value = (value * 100).toFixed(2);  // Convert to percentage and round to 2 decimals
        } else {
            value = Math.round(value);  // Round values like fpRate
        }

        var curCell = row.insertCell();
        curCell.innerHTML = `${value}`;
        curCell.style = `text-align: center;`;
    });
    tableBody.appendChild(row);  // Append the row to the table body
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

        const algorithmData = data[algorithm];  // Get the algorithm data
        const datasets = Object.keys(algorithmData);  // Get the datasets for this algorithm

        // Update table headers dynamically with dataset names
        const eventHeader = document.getElementById('event-table-header');
        const sampleHeader = document.getElementById('sample-table-header');

        // Empty header for metrics
        // eventHeader.innerHTML = `<th></th>`;
        // sampleHeader.innerHTML = `<th></th>`;

        // Create header cells for each dataset in both tables
        // datasets.forEach(dataset => {
        //     eventHeader.innerHTML += `<th>${dataset}</th>`;
        //     sampleHeader.innerHTML += `<th>${dataset}</th>`;
        // });

        // Get the list of metrics
        const metrics = ['f1', 'sensitivity', 'precision', 'fpRate'];
        const metricTitles = ['F1 (%)', 'Sensitivity (%)', 'Precision (%)', 'False Positives per Day']
        
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
        const response = await fetch(`/challenge_algorithms/${fileName}.yaml`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const yamlText = await response.text();
        // console.log(yamlText)

        // Parse the YAML content into a JavaScript object
        const parsedData = jsyaml.load(yamlText);

        // Dynamically update the title of the page with the algorithm title
        document.title = parsedData.title || "Algorithm Description";

        // Fill in the HTML content
        fillContent(parsedData);
    } catch (error) {
        // document.getElementById('content').innerHTML = `<p style="color: red;">Error loading YAML: ${error.message}</p>`;
    }
}

function formatAuthors(authors) {
    const listItems = authors.map(author => {
        const name = `${author['given-names']} ${author['family-names']} ( ${author['affiliation']} )`;
        const orcid = author.orcid ? ` - <a href="${author.orcid}" target="_blank">ORCID</a>` : '';
        return `<li class="author">${name}${orcid}</li>`;
    }).join('');

    return `<ul>${listItems}</ul>`;
}

// Function to format datasets section
function formatDatasets(datasets) {
    return datasets.map(dataset => {
        return `
            <div class="dataset">
                <h3>${dataset.title}</h3>
                <p><strong>License:</strong> ${dataset.license}</p>
                <h4>Identifiers:</h4>
                ${dataset.identifiers.map(id => {
                    return `
                        <ul>
                            <li><strong>Description:</strong> ${id.description}</li>
                            <li><strong>Type:</strong> ${id.type}</li>
                            <li><strong>Value:</strong> <a href="https://doi.org/${id.value}" target="_blank">${id.value}</a></li>
                        </ul>
                    `;
                }).join('')}
            </div>
        `;
    }).join('');
}

// Function to fill the content in the HTML page
function fillContent(data) {
    // Update algorithm title and image
    document.getElementById('algorithm-title').innerText = data.title || "No title provided";

    // Update version and release date
    document.getElementById('algorithm-version').innerText = data.version || "N/A";
    document.getElementById('release-date').innerText = data['date-released'] || "N/A";

    // Update abstract section
    document.getElementById('abstract-text').innerText = data.abstract || "No abstract available";

    // Update authors section
    const authorsContent = formatAuthors(data.authors);
    document.getElementById('authors-list').innerHTML = authorsContent;

    // Update dataset section
    const datasetsContent = formatDatasets(data.Dataset);
    document.getElementById('datasets-list').innerHTML = datasetsContent;

    // Update repository section
    document.getElementById('repository-url').innerHTML = `<a href="${data.repository}" target="_blank">${data.repository}</a>`;
    document.getElementById('license-text').innerText = data.license || "No license available";
    document.getElementById('algorithm-image').innerHTML = `<a href="${data.image}" target="_blank">${data.image}</a>`;

}

// Get the filename from the URL query parameter 'algo'
const yamlFileName = getQueryParam('algo');

// Load the YAML file based on the 'algo' query parameter
loadYAML(yamlFileName);
// Call the function to load and populate the results when the page is loaded
document.addEventListener('DOMContentLoaded', loadResults);
