import requests
import re
import os
import bibtexparser
from bibtexparser.bwriter import BibTexWriter
from bibtexparser.bparser import BibTexParser

# --- Configuration ---
PAPER_DOI = "10.1111/epi.18113"  # SzCore paper
OUTPUT_BIB_FILE = "website/static/bib/citations.bib"


# --- Script ---
def fetch_citations(doi):
    """Fetches citation data from the Semantic Scholar API."""
    print(f"Fetching citations for DOI: {doi}")
    fields = "title,authors,year,venue,externalIds"
    api_url = f"https://api.semanticscholar.org/graph/v1/paper/DOI:{doi}/citations?fields={fields}"

    try:
        response = requests.get(api_url)
        response.raise_for_status()
        data = response.json()
        return data.get("data", [])
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return None


def generate_bibtex_key(paper_details):
    """Generates a BibTeX key for a single paper."""
    bib_key = ""
    authors = paper_details.get("authors", [])
    if authors:
        first_author_lastname = authors[0].get("name", "unknown").split()[-1].lower()
        bib_key += re.sub(r"\W+", "", first_author_lastname)

    year = paper_details.get("year")
    if year:
        bib_key += str(year)

    title = paper_details.get("title", "untitled")
    first_word_of_title = title.split()[0].lower()
    bib_key += re.sub(r"\W+", "", first_word_of_title)

    if not bib_key:
        bib_key = paper_details.get("paperId", "no_id")
    return bib_key


def create_bibtex_entry(paper):
    """Creates a BibTeX entry for a single paper."""
    paper_details = paper.get("citingPaper", {})

    entry = {}
    entry["ID"] = generate_bibtex_key(paper_details)
    entry["ENTRYTYPE"] = "article" if paper_details.get("venue") else "misc"
    entry["title"] = paper_details.get("title", "No Title")

    authors = paper_details.get("authors", [])
    if authors:
        author_str = " and ".join(
            [
                (
                    author['name']
                    if len(author['name'].split()) == 1
                    else f"{author['name'].split()[-1]}, {' '.join(author['name'].split()[:-1])}"
                )
                for author in authors
            ]
        )
        entry["author"] = author_str

    if paper_details.get("year"):
        entry["year"] = str(paper_details.get("year"))

    if paper_details.get("venue"):
        entry["journal" if entry["ENTRYTYPE"] == "article" else "booktitle"] = (
            paper_details.get("venue")
        )

    doi = paper_details.get("externalIds", {}).get("DOI")
    if doi:
        entry["doi"] = doi

    return entry


def main():
    """Main function to run the script."""

    # Get existing entries
    existing_entries = []
    if os.path.exists(OUTPUT_BIB_FILE):
        try:
            with open(OUTPUT_BIB_FILE, "r", encoding="utf-8") as f:
                parser = BibTexParser(common_strings=True)
                bib_database = bibtexparser.load(f, parser=parser)
                existing_entries = bib_database.entries
            print(f"Found {len(existing_entries)} existing citations.")
        except Exception as e:
            print(f"Warning: Failed to parse existing BibTeX file '{OUTPUT_BIB_FILE}': {e}")
            print("Proceeding with no existing citations.")

    existing_keys = {entry["ID"] for entry in existing_entries}

    citations = fetch_citations(PAPER_DOI)

    new_entries_added = False
    if citations:
        all_entries = list(existing_entries)
        for c in citations:
            entry = create_bibtex_entry(c)
            if entry["ID"] not in existing_keys:
                all_entries.append(entry)
                new_entries_added = True

        if new_entries_added:
            print(f"Adding {len(all_entries) - len(existing_entries)} new citations.")

            # Sort entries by year (desc) and then author (asc)
            all_entries.sort(
                key=lambda entry: (
                    -int(entry.get("year", 0)),
                    entry.get("author", "").lower(),
                )
            )

            db = bibtexparser.bibdatabase.BibDatabase()
            db.entries = all_entries

            writer = BibTexWriter()
            writer.indent = "  "
            writer.comma_first = False

            os.makedirs(os.path.dirname(OUTPUT_BIB_FILE), exist_ok=True)
            with open(
                OUTPUT_BIB_FILE, "w", encoding="utf-8"
            ) as f:  # Overwrite with sorted list
                f.write(writer.write(db))

            print(f"✅ Successfully updated and sorted {OUTPUT_BIB_FILE}.")
        else:
            print("No new citations to add.")


if __name__ == "__main__":
    main()
