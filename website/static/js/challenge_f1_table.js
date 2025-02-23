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

        const briefSummary = briefSummaries[algorithm]
        row.appendChild(createTableCellLink(data[algorithm].algorithm_name, "/challenge_algorithm/?algo=" + algorithm, briefSummary)); // Add algorithm name as row header

        // Add F1 score for each dataset
        metrics.forEach((metric, i) => {
            var metricScore;
            if (metric === 'fpRate'){
                metricScore = Math.round(data[algorithm].evaluation_dataset[events_or_samples][metric]) ?? ''; // Handle missing data
            } else {
                metricScore = Math.round(data[algorithm].evaluation_dataset[events_or_samples][metric] * 100) ?? ''; // Handle missing data
            }
            const metricCell = createTableCell(metricScore);
            metricCell.classList.add('text-center');
                    if ((metricScore !== '') && !(metric === "fpRate")) {
                        // const color = getColorForScore(metricScore);
                        const color = getThemePurpleColorForScore(metricScore);
                        metricCell.style.backgroundColor = color.bgColor;
                        metricCell.style.color = color.textColor;
                    }

                    row.appendChild(metricCell);
        });

        tableBody.appendChild(row);
    });
    updateMetricSort();
}

// Helper function to create a table cell
function createTableCell(content) {
    const td = document.createElement("td");
    td.textContent = content;
    return td;
}

function createTableCellLink(content, url, briefSummary) {

    const td = document.createElement("td");

    const div = document.createElement("div");
    div.className = "tooltip";

    const span = document.createElement("span");
    span.className = "tooltiptext";
    span.innerHTML = briefSummary;

    const a = document.createElement("a");
    a.setAttribute('href',url);
    a.innerHTML = content;

    // a.onmouseover = function(e) {
    //     var briefDescriptor = document.getElementById("brief-algorithm-summary");
    //     briefDescriptor.innerHTML = "<strong style=\"color:#7b39ed;\">Brief Summary. </strong>" + briefSummary 
    //     + "<br><em> Click on method name for more details. </em>";
    // };
    // a.onmouseout = function(e) {
    //     var briefDescriptor = document.getElementById("brief-algorithm-summary");
    //     briefDescriptor.innerHTML = "";
    // };

    div.appendChild(a)
    div.appendChild(span)

    td.appendChild(div);
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

function getThemePurpleColorForScore(score) {
    // Normalize the score between 0 and 1
    const normalizedScore = score / 100;


    const hue_max = 262;
    const saturation_max = 76;
    const value_max = 93;

    // Define color changing saturation
    const saturation = normalizedScore * saturation_max;

    rgb = HSVtoRGB(hue_max / 360.0, saturation / 100.0, value_max / 100.0);
    const red = rgb.r;
    const green = rgb.g;
    const blue = rgb.b;

    // Calculate the luminance of the color to determine text color
    const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    const textColor = luminance > 128 ? 'black' : 'white'; // Dark text for light background, light text for dark background

    // Return the color and text color
    return {
        bgColor: `rgb(${red}, ${green}, ${blue})`,
        textColor: textColor
    };
}

// Function required by getThemePurpleColorForScore to convert HSV to RGB
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
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
        x = rows[i].getElementsByTagName("TD")[column_number];
        y = rows[i + 1].getElementsByTagName("TD")[column_number];
        // Check if the two rows should switch place:

        var x_value = 0;
        var y_value = 0;
        if (x.innerHTML.toLowerCase() != "nan"){
            x_value = parseInt(x.innerHTML.toLowerCase());
        }
        if (y.innerHTML.toLowerCase() != "nan"){
            y_value = parseInt(y.innerHTML.toLowerCase());
        }

        if ( x_value < y_value) {
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

function updateSampleEventSelect(){
    var tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    var tableHead = document.getElementById("table-header");
    tableHead.innerHTML = "";
    
    var eventSampleSelect = document.getElementById('sample-event-select').value;
    console.log(eventSampleSelect)
    loadResults(eventSampleSelect);
}


// Call the function to load results and populate the table
loadResults('event_results');