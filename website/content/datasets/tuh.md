---
title: "TUH Sz - Epilepsy benchmarks"
description: "SzCORE benchmark on the TUH EEG Seizure Corpus."
---

- v2.0.3

This database is a subset of the TUH EEG Corpus that was collected from archival records of clinical EEG at Temple University Hospital recorded between 2002 – 2017. From this large dataset, a subset of files with a high likelihood of containing seizures was retained based on clinical notes and on the output of seizure detection algorithms.

V2.0.3 contains 7377 .`edf` files from 675 subjects for a total duration of 1476 hours of data. The files are mostly short (avg. 10 minutes). The dataset has heterogeneous sampling frequency and number of channels. All files are acquired at a minimum of 250 Hz. A minimum of 17 EEG channels is available in all recordings. They are positioned according to the 10-20 system.

The annotations are provided as `.csv` and contain the start time, stop, channel and seizure type.

{{< button href="https://isip.piconepress.com/projects/tuh_eeg" >}}
TUH EEG Sz Corpus
{{< /button >}}

{{< dataset_table dataset=tuh >}}
