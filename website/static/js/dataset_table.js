// Fetch the bundled results JSON
async function loadResults(events_or_samples) {
    const response = await fetch('/results.json'); // Path to the bundled JSON file
    const data = await response.json();

    const algorithms = Object.keys(data);
    const tableElement = document.getElementById("results");
    const dataset = tableElement.getAttribute("data-source");

    const metrics = ["f1", "sensitivity", "precision", "fpRate"]
    const metricNames = ["F1-score", "Sensitivity", "Precision", "False Positives"]

    const tableHeaderRow = document.getElementById("table-header");
    const tableBody = document.getElementById("table-body");

    // Add an empty cell in the top-left corner
    tableHeaderRow.appendChild(createTableCell("Algorithms"));

    // Add dataset names as column headers
    metrics.forEach((metricNames, i) => {
        const headerCell = createTableCell(metricNames);
        headerCell.classList.add('text-center');
        headerCell.classList.add('w-24');
        tableHeaderRow.appendChild(headerCell);
    });

    // Add a row for each algorithm
    algorithms.forEach(async algorithm => {
        if (dataset in data[algorithm]){
            const row = document.createElement("tr");

            const shortTitle = await fetchShortTitle(algorithm);
            row.appendChild(createTableCellLink(shortTitle || algorithm, `/algorithm/?algo=${algorithm}`));
    
            // Add F1 score for each dataset
            metrics.forEach((metric, i) => {
                var metricScore;
                if (metric === 'fpRate'){
                    metricScore = Math.round(data[algorithm][dataset][events_or_samples][metric]) ?? ''; // Handle missing data
                } else {
                    metricScore = Math.round(data[algorithm][dataset][events_or_samples][metric] * 100) ?? ''; // Handle missing data
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
        }

    });
    updateMetricSort();
}

// Helper function to fetch the short_title from the YAML file
async function fetchShortTitle(algorithm) {
    try {
        const response = await fetch(`/algorithms/${algorithm}.yaml`);
        if (!response.ok) {
            console.error(`Failed to fetch YAML for algorithm: ${algorithm}`);
            return null;
        }
        const yamlText = await response.text();
        const yamlData = jsyaml.load(yamlText); // Use js-yaml to parse the YAML file
        return yamlData.short_title || null; // Return the short_title if it exists
    } catch (error) {
        console.error(`Error fetching or parsing YAML for algorithm: ${algorithm}`, error);
        return null;
    }
}

// Helper function to create a table cell
function createTableCell(content) {
    const td = document.createElement("td");
    td.textContent = content;
    return td;
}

// Helper function to create a table cell with a link
function createTableCellLink(content, url) {
    const td = document.createElement("td");
    const a = document.createElement("a");
    a.setAttribute('href', url);
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