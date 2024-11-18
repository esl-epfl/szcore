---
title: "Tools"
description: "We provide tools to streamline the processing of EEG for the task of automated seizure detection."
---

We provide certain tools to encourage reproducibility and consistency of results reported in the field of automated seizure detection algorithm.

## epilepsy2bids

> A library to convert datasets to BIDS and to manipulate BIDS files.

{{< github repo="esl-epfl/epilepsy2bids" >}}

Library for converting EEG datasets of people with epilepsy to [EEG-BIDS](https://doi.org/10.1038/s41597-019-0104-8) compatible datasets. These datasets comply with the [ILAE and IFCN minimum recording standards](https://doi.org/10.1016/j.clinph.2023.01.002). They provide annotations that are [HED-SCORE](http://arxiv.org/pdf/2310.15173) compatible. The datasets are formatted to be operated by the [SzCORE seizure validation framework](https://doi.org/10.1111/epi.18113).

The library provides tools to:

- Convert EEG datasets to BIDS.
- Load and manipulate EDF files.
- Load and manipulate seizure annotation files.

Currently, the following datasets are supported:

- [PhysioNet CHB-MIT Scalp EEG Database v1.0.0](https://doi.org/10.13026/C2K01R)
- [KULeuven SeizeIT1](https://doi.org/10.48804/P5Q0OJ)
- [Siena Scalp EEG Database v1.0.0](https://doi.org/10.13026/s309-a395)
- [TUH EEG Seizure Corpus](https://isip.piconepress.com/projects/nedc/html/tuh_eeg/)

## timescoring

{{< github repo="esl-epfl/timescoring" >}}

We built a library that provides different scoring methodologies to compare a reference time series with binary annotation (ground-truth annotations of the neurologist) to hypothesis binary annotations (provided by a machine learning pipeline). These different scoring methodologies provide a count of correctly identified events (True Positives) as well as missed events (False Negatives) and wrongly marked events (False positions)

In more details, we measure performance on the level of:

- Samples : Performance metric that threats every label sample independently.
- Events (e.g. epileptic seizure) : Classifies each event in both reference and hypothesis based on overlap of both.

Both methods are illustrated in the following figures :

![Illustration of sample based scoring.](https://user-images.githubusercontent.com/747240/248309097-b7f76fde-c87a-41df-812d-9821375b640e.png)

![Illustration of event based scoring.](https://user-images.githubusercontent.com/747240/248308898-64b4ae39-d02f-4f06-9b10-f07aaf6110d1.png)

## szcore-evaluation

{{< github repo="esl-epfl/szcore-evaluation" >}}

The library provides a single function to evaluate a set of annotations.

```python
def evaluate_dataset(
    reference: Path, hypothesis: Path, outFile: Path, avg_per_subject=True
) -> dict:
    """
    Compares two sets of seizure annotations accross a full dataset.

    Parameters:
    reference (Path): The path to the folder containing the reference TSV files.
    hypothesis (Path): The path to the folder containing the hypothesis TSV files.
    outFile (Path): The path to the output JSON file where the results are saved.
    avg_per_subject (bool): Whether to compute average scores per subject or
                            average across the full dataset.

    Returns:
    dict. return the evaluation result. The dictionary contains the following
          keys: {'sample_results': {'sensitivity', 'precision', 'f1', 'fpRate',
                    'sensitivity_std', 'precision_std', 'f1_std', 'fpRate_std'},
                 'event_results':{...}
                 }
    """
```

## sz-validation-framework

{{< github repo="esl-epfl/sz-validation-framework" >}}

Example code that uses the framework for the validation of EEG based automated seizure detection algorithms.

The repository provides code to :

1. Convert EDF files from most open scalp EEG datasets of people with epilepsy to a standardized format
2. Convert seizure annotations from these datasets to a standardized format.
3. Evaluate the performance of seizure detection algorithm.

## szcore

{{< github repo="esl-epfl/szcore" >}}

Repository that implements a Continuous Integration pipeline for the evaluation of seizure detection algorithms. This is the repository used to populate the [benchmark page](/benchmark).
