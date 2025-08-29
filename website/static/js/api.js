import { getQueryParam } from './utils.js';

// Generic function to fetch JSON data
async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load JSON from ${url}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Generic function to fetch and parse a YAML file
async function fetchYAML(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Network response was not ok for ${url}`);
        }
        const yamlText = await response.text();
        return jsyaml.load(yamlText);
    } catch (error) {
        console.error(`Error loading YAML from ${url}:`, error);
        return null;
    }
}

export async function getAlgorithmData(isChallenge = false) {
    const algorithm = getQueryParam('algo');
    if (!algorithm) {
        alert("Algorithm not specified in the URL.");
        return;
    }

    const resultsUrl = isChallenge ? '/challenge_results.json' : '/results.json';
    const results = await fetchJSON(resultsUrl);

    if (!results || !results[algorithm]) {
        alert(`Algorithm "${algorithm}" not found in ${resultsUrl}.`);
        return null;
    }

    return results[algorithm];
}


export async function getAlgorithmYaml(isChallenge = false) {
    const algorithm = getQueryParam('algo');
    if (!algorithm) {
        alert("Algorithm not specified in the URL.");
        return;
    }
    const yamlUrl = isChallenge ? `/challenge_algorithms/${algorithm}.yaml` : `/algorithms/${algorithm}.yaml`;
    return await fetchYAML(yamlUrl);
}

// Helper function to fetch the short_title from the YAML file
export async function fetchShortTitle(algorithm) {
    const yamlData = await fetchYAML(`/algorithms/${algorithm}.yaml`);
    return yamlData ? yamlData.short_title : null;
}

// Helper function to fetch the training datasets from the YAML file
export async function fetchTrainingDatasets(algorithm) {
    const yamlData = await fetchYAML(`/algorithms/${algorithm}.yaml`);
    if (!yamlData || !yamlData.datasets) {
        return null;
    }

    return yamlData.datasets.map(dataset => {
        const mapping = {
            'Physionet CHB-MIT Scalp EEG dataset': 'chbmit',
            'Physionet Siena Scalp EEG': 'siena',
            'TUH Seizure Corpus': 'tuh',
            'KU Leuven SeizeIT1': 'seizeit',
            'Dianalund Scalp EEG dataset': 'dianalund'
        };
        return mapping[dataset] || dataset;
    });
}
