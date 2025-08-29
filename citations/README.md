# Citations Updater

This directory contains a Python script (`update_citations.py`) to automatically update the list of citations for [*"SzCORE: Seizure Community Open-Source Research Evaluation framework for the validation of electroencephalography-based automated seizure detection algorithms"*](https://doi.org/10.1111/epi.18113) paper.

## How it Works

The script performs the following actions:

1. **Fetches Citations**: It uses the Semantic Scholar API to fetch all citations for the paper with DOI `10.1111/epi.18113`.
2. **Reads Existing Data**: It reads the existing `website/static/bib/citations.bib` file to get a list of citation keys that are already present.
3. **Appends New Citations**: It compares the fetched citations with the existing ones and appends only the new citations to the `citations.bib` file. This incremental approach ensures that any manual additions or modifications to the file are preserved.
4. **Sorts and Writes Citations**: The script then sorts the entire collection of citations (both existing and new) by year (descending) and then by author name (ascending). It overwrites the `citations.bib` file with this newly sorted list. This approach ensures that the file is always well-organized and that manual additions are preserved and sorted as well.
5. **Generates BibTeX**: The script generates BibTeX entries for the new citations using the `bibtexparser` library.

## Automation

This script is automatically executed on a weekly schedule by the `update-citations.yml` GitHub Actions workflow located in the `.github/workflows` directory. The workflow installs the necessary dependencies (`requests`, `bibtexparser`), runs the script, and commits the updated `citations.bib` file back to the repository.
