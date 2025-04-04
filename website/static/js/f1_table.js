// Fetch the bundled results JSON
async function loadResults() {
    const response = await fetch('/results.json'); // Path to the bundled JSON file
    const data = await response.json();

    const algorithms = Object.keys(data);


    const tableBody = document.getElementById("table-body");
    // Get datasets from the table header row, skipping the first column
    const tableHeaderRow = document.getElementById("table-header");
    const headerCells = tableHeaderRow.querySelectorAll("td");
    const datasets = new Set();
    headerCells.forEach((cell, index) => {
        if (index > 0) { // Skip the first column
            datasets.add(cell.textContent.trim());
        }
    });

    // Add a row for each algorithm
    for (const algorithm of algorithms) {
        const row = document.createElement("tr");

        // Fetch the short_title from the YAML file
        const shortTitle = await fetchShortTitle(algorithm);

        // Add short_title as the row header with a link
        row.appendChild(createTableCellLink(shortTitle || algorithm, `/algorithm/?algo=${algorithm}`));

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
    }
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

// Helper function to get color for F1 score
function getColorForScore(score) {
    const normalizedScore = score / 100;

    const hue_max = 262;
    const saturation_max = 76;
    const value_max = 93;

    const saturation = normalizedScore * saturation_max;

    const rgb = HSVtoRGB(hue_max / 360.0, saturation / 100.0, value_max / 100.0);
    const red = rgb.r;
    const green = rgb.g;
    const blue = rgb.b;

    const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    const textColor = luminance > 128 ? 'black' : 'white';

    return {
        bgColor: `rgb(${red}, ${green}, ${blue})`,
        textColor: textColor
    };
}

// Function to convert HSV to RGB
function HSVtoRGB(h, s, v) {
    let r, g, b, i, f, p, q, t;
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