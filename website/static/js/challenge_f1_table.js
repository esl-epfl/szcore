// Fetch the bundled results JSON
async function loadResults() {
    const response = await fetch('/challenge_results.json'); // Path to the bundled JSON file
    const data = await response.json();

    const algorithms = Object.keys(data);
    const datasets = new Set();
    algorithms.forEach(algorithm => {
        Object.keys(data[algorithm]).forEach(dataset => {
            datasets.add(dataset);
        });
    });

    const metrics = ["f1", "sensitivity", "precision", "fpRate"]
    const metricNames = ["F1-score", "Sensitivity", "Precision", "False Positives"]

    const tableHeaderRow = document.getElementById("table-header");
    const tableBody = document.getElementById("table-body");

    // Add an empty cell in the top-left corner
    tableHeaderRow.appendChild(createTableCell("Algorithms"));

    // Add dataset names as column headers
    metrics.forEach((dataset, i) => {
        const headerCell = createTableCell(metricNames[i]);
        headerCell.classList.add('text-center');
        headerCell.classList.add('w-16');
        tableHeaderRow.appendChild(headerCell);
    });

    // Add a row for each algorithm
    algorithms.forEach(algorithm => {
        const row = document.createElement("tr");

        row.appendChild(createTableCellLink(data[algorithm].algorithm_name, "/challenge_algorithm/?algo=" + algorithm)); // Add algorithm name as row header

        // Add F1 score for each dataset
        metrics.forEach((metric, i) => {
            const metricScore = Math.round(data[algorithm].evaluation_dataset.event_results[metric] * 100) ?? ''; // Handle missing data
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
}

// Helper function to create a table cell
function createTableCell(content) {
    const td = document.createElement("td");
    td.textContent = content;
    return td;
}

function createTableCellLink(content, url) {
    const td = document.createElement("td");
    const a = document.createElement("a");
    a.setAttribute('href',url);
    a.innerHTML = content;
    td.appendChild(a);
    return td;
}

function getColorForScore(score) {
    // Normalize the score between 0 and 1
    const normalizedScore = score / 100;

    // Define color range from red to green
    const red = Math.max(255 - Math.floor(normalizedScore * 255), 0); // Red decreases as score increases
    const green = Math.min(Math.floor(normalizedScore * 255), 255); // Green increases as score increases
    const blue = 0; // No blue component for simplicity

    // Calculate the luminance of the color to determine text color
    const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    const textColor = luminance > 128 ? 'black' : 'white'; // Dark text for light background, light text for dark background

    // Return the color and text color
    return {
        bgColor: `rgb(${red}, ${green}, ${blue})`,
        textColor: textColor
    };
}


// Call the function to load results and populate the table
loadResults();