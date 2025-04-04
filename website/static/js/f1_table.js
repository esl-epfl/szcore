// Fetch the bundled results JSON
async function loadResults() {
    const response = await fetch('/results.json'); // Path to the bundled JSON file
    const data = await response.json();

    const algorithms = Object.keys(data);
    const datasets = new Set();
    algorithms.forEach(algorithm => {
        Object.keys(data[algorithm]).forEach(dataset => {
            datasets.add(dataset);
        });
    });

    const tableHeaderRow = document.getElementById("table-header");
    const tableBody = document.getElementById("table-body");

    // Add an empty cell in the top-left corner
    tableHeaderRow.appendChild(createTableCell("Algorithms"));

    // Add dataset names as column headers
    datasets.forEach(dataset => {
        const headerCell = createTableCell(dataset.replace(".json", ""));
        headerCell.classList.add('text-center');
        headerCell.classList.add('w-16');
        tableHeaderRow.appendChild(headerCell);
    });

    // Add a row for each algorithm
    algorithms.forEach(algorithm => {
        const row = document.createElement("tr");
        row.appendChild(createTableCellLink(algorithm, "/algorithm/?algo=" + algorithm)); // Add algorithm name as row header

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


// Call the function to load results and populate the table
loadResults();