// Fetch the bundled results JSON
async function loadResults() {
    const response = await fetch('results.json'); // Path to the bundled JSON file
    const data = await response.json();

    const algorithms = Object.keys(data);
    const datasets = Object.keys(data[algorithms[0]]);

    const tableHeaderRow = document.getElementById("table-header");
    const tableBody = document.getElementById("table-body");

    // Add an empty cell in the top-left corner
    tableHeaderRow.appendChild(createTableCell("Algorithms"));

    // Add dataset names as column headers
    datasets.forEach(dataset => {
        const headerCell = createTableCell(dataset.replace(".json", ""));
        headerCell.classList.add('text-center');
        tableHeaderRow.appendChild(headerCell);
    });

    // Add a row for each algorithm
    algorithms.forEach(algorithm => {
        const row = document.createElement("tr");
        row.appendChild(createTableCellLink(algorithm, "algorithm.html?algo=" + algorithm)); // Add algorithm name as row header

        // Add F1 score for each dataset
        datasets.forEach(dataset => {
            const f1Score = Math.round(data[algorithm][dataset]?.event_results?.f1 * 100) ?? ''; // Handle missing data
            const f1Cell = createTableCell(f1Score);
            f1Cell.classList.add('text-center');
                    if (f1Score !== '') {
                        const color = getColorForScore(f1Score);
                        f1Cell.style.backgroundColor = color.bgColor;
                        f1Cell.style.color = color.textColor;
                    }

                    row.appendChild(f1Cell);
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