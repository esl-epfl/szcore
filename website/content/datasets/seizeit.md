---
title: "SeizeIT1 - Epilepsy benchmarks"
description: "SzCORE benchmark on KULeuven SeizeIT1."
---

{{< alert "lock" >}}
The dataset is mostly kept private for independent evaluation of algorithms.
{{< /alert >}}

- v1.0.0

The dataset was acquired at UZ Leuven on a population of adults hospitalized for pre-surgical evaluation. The dataset was first made publicly available as part of an [IEEE ICASSP 2023 seizure detection challenge](https://biomedepi.github.io/seizure_detection_challenge/). The dataset contains recordings of 42 subjects.

The signals were acquired at 250 Hz and contain 24 EEG channels positioned according to the 10-20 system. Most sessions contain additional physiological signals such as ECG along with 4 extra EEG channels placed behind the ears. Files are stored as `.edf` files of approximately 9 hours. On average 4 days of data are recorded per patient.

The annotations are provided in `.tsv` and contain the start time, end time, seizure type and localization information of each seizure.

{{< button href="https://rdr.kuleuven.be/dataset.xhtml?persistentId=doi:10.48804/P5Q0OJ" >}}
SeizeIT1
{{< /button >}}

{{< dataset_table dataset=seizeit >}}
