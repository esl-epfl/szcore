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
    sortTable(1);
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

function sortTable(column_number) {
    var table = document.getElementById("table-body");
    var switching, i, x, y, shouldSwitch;
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 0; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        console.log(rows[i].getElementsByTagName("TD"))
        x = rows[i].getElementsByTagName("TD")[column_number];
        y = rows[i + 1].getElementsByTagName("TD")[column_number];
        // Check if the two rows should switch place:
        if (parseInt(x.innerHTML.toLowerCase()) < parseInt(y.innerHTML.toLowerCase())) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }

function updateMetricSort(){
    var metricSortSelect = document.getElementById('metric-sort-select').value;
    sortTable(parseInt(metricSortSelect));
}


// Call the function to load results and populate the table
loadResults();