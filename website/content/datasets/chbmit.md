---
title: "CHB-MIT - Epilepsy benchmarks"
description: "SzCORE benchmark on the Physionet CHB-MIT Scalp EEG Database."
---

- v1.0.0

This database is one of the oldest large publicly available scalp EEG datasets of people with epilepsy. It consists of 24 sessions of continuous EEG collected on 23 children (aged 1.5-22y). It was collected at the Boston Children’s Hospital. The subjects were monitored for up to several days following withdrawal of anti-seizure medication in order to characterize their seizures and assess their candidacy for surgical intervention.

The signals were acquired at 256 Hz and contain a minimum of 23 EEG channels positioned according to the 10-20 system. Some sessions contain additional physiological signals such as ECG or vagal nerve stimulation. Files are stored as `.edf` in recordings of one hour to four hours long. In most cases, time gaps between recordings are shorter than 10 seconds. Total session duration per subject is at least 19 hours.

The annotations are marked as the start and stop time of each epileptic seizure. They are provided as text file and as PhysioNet binary `.seizure` files.

The original dataset can be downloaded on the [Physionet website](https://physionet.org/content/chbmit/1.0.0/). We also compiled a BIDS compatible version of the dataset that implements the standardized format described in this framework. It can be downloaded on [Zenodo](https://zenodo.org/records/10259996).

{{< button href="https://zenodo.org/records/10259996" >}}
BIDS CHB-MIT Scalp EEG Database
{{< /button >}}

{{< dataset_table dataset=chbmit >}}
