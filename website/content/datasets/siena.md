---
title: "Siena - Epilepsy benchmarks"
description: "SzCORE benchmark on the Physionet Siena Scalp EEG."
---

- v1.0.0

The database consists of EEG recordings of 14 patients acquired at the Unit of Neurology and Neurophysiology of the University of Siena. All subjects are adults (ages 20-71y).

The signals were acquired at 512 Hz and contain a minimum of 21 EEG channels positioned according to the 10-20 system. Most sessions contain additional physiological signals such as ECG. Files are stored as `.edf` in recordings of maximum 2 GB. Total recording duration per subject is at least 2 hours.

The annotations are provided in text format and contain the start time and end times of seizures.

The original dataset can be downloaded on the [Physionet website](https://physionet.org/content/siena-scalp-eeg/1.0.0/). We also compiled a BIDS compatible version of the dataset that implements the standardized format described in this framework. It can be downloaded on [Zenodo](https://zenodo.org/records/10640762).

{{< button href="https://zenodo.org/records/10640762" >}}
BIDS Siena Scalp EEG Database
{{< /button >}}

{{< dataset_table dataset=siena >}}
