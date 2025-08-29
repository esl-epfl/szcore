// Helper function to create a table cell
export function createTableCell(content) {
    const td = document.createElement("td");
    td.textContent = content;
    return td;
}

// Helper function to create a table cell with a link
export function createTableCellLink(content, url, briefSummary = null) {
    const td = document.createElement("td");
    const a = document.createElement("a");
    a.href = url;
    a.innerHTML = content;

    if (briefSummary) {
        const div = document.createElement("div");
        div.className = "tooltip";
        const span = document.createElement("span");
        span.className = "tooltiptext";
        span.innerHTML = briefSummary;
        div.appendChild(a);
        div.appendChild(span);
        td.appendChild(div);
    } else {
        td.appendChild(a);
    }

    return td;
}

export function formatAuthors(authors, isChallenge = false) {
    const listItems = authors.map(author => {
        let name;
        if (isChallenge) {
            name = `${author['given_names']} ${author['family_names']} ( ${author['affiliation']} )`;
        } else {
            name = `${author['given_names']} ${author['family_names']}`;
        }
        const orcid = author.orcid ? ` - <a href="${author.orcid}" target="_blank">ORCID</a>` : '';
        return `<li class="author">${name}${orcid}</li>`;
    }).join('');

    return `<ul>${listItems}</ul>`;
}

export function formatDatasets(datasets, isChallenge = false) {
    if (isChallenge) {
        return datasets.map(dataset => `
            <div class="dataset">
                <h3>${dataset.title}</h3>
                <p><strong>License:</strong> ${dataset.license}</p>
                <h4>Identifiers:</h4>
                ${dataset.identifiers.map(id => `
                    <ul>
                        <li><strong>Description:</strong> ${id.description}</li>
                        <li><strong>Type:</strong> ${id.type}</li>
                        <li><strong>Value:</strong> <a href="https://doi.org/${id.value}" target="_blank">${id.value}</a></li>
                    </ul>
                `).join('')}
            </div>
        `).join('');
    } else {
        const listItems = datasets.map(dataset => `<li>${dataset}</li>`).join('');
        return `<ul>${listItems}</ul>`;
    }
}

export function fillContent(data, isChallenge = false) {
    document.title = data.title || "Algorithm Description";
    document.getElementById('algorithm-title').innerText = data.title || "No title provided";
    document.getElementById('algorithm-version').innerText = data.version || "N/A";
    document.getElementById('release-date').innerText = data['date_released'] || "N/A";
    document.getElementById('abstract-text').innerText = data.abstract || "No abstract available";
    document.getElementById('authors-list').innerHTML = formatAuthors(data.authors, isChallenge);
    document.getElementById('datasets-list').innerHTML = formatDatasets(data.datasets, isChallenge);
    document.getElementById('repository-url').innerHTML = `<a href="${data.repository}" target="_blank">${data.repository}</a>`;
    document.getElementById('license-text').innerText = data.license || "No license available";

    const imageLink = document.getElementById('algorithm-image');
    if (imageLink) {
        imageLink.innerHTML = `<a href="${data.image}" target="_blank">${data.image}</a>`;
    }
}
