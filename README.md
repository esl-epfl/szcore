# SZcore

- website: [https://esl-epfl.github.io/szcore/](https://esl-epfl.github.io/szcore/)

## Background

This repository hosts an open [seizure detection benchmarking platform](https://esl-epfl.github.io/szcore/).
The aim is to provide an open source platform for the community to submit their seizure detection algorithms and provide automatic benchmark results on various high quality datasets.

## Usage

Users can submit a containerized algorithm by opening a PR adding a yaml file in the `algorithms` directory. The yaml file should describe their algorithm following our schema (see [example](algorithms/gotman.yaml)) and point to a publicly available docker image based on our template (see [config/template.Dockerfile](config/template.Dockerfile)).

Once the PR is merged, this image is used to execute the algorithm on GitHub actions, compute performance metrics and update a [static website](https://esl-epfl.github.io/szcore/) hosted on GitHub pages.

## Data flow

![overview](./doc/overview.svg)

## Acknowledgement

This project was developed as part of the [ORD for the Sciences hackathon](https://sdsc-hackathons.ch/) organized by [EPFL Open Science](https://www.epfl.ch/research/open-science/) and [SDSC](http://datascience.ch/) by the team "zinalrothorn", composed of [@EishaMazhar](https://github.com/EishaMazhar), [@danjjl](https://github.com/danjjl), [@esthertsw](https://github.com/esthertsw) and [@cmdoret](https://github.com/cmdoret).

SzCORE originated from the synergy of the [Pedesite](https://data.snf.ch/grants/grant/193813) consortium ([EPFL-ESL](https://www.epfl.ch/labs/esl/), [ETH-IIS](https://iis.ee.ethz.ch/), [CHUV](https://www.chuv.ch/fr/neurologie/nlg-home), [EPFL-LTS4](https://www.epfl.ch/labs/lts4/)).
