# syntax=docker/dockerfile:1

ARG PYTHON_VERSION=3.12
FROM python:${PYTHON_VERSION}-slim as base

# Prevents Python from writing pyc files.
ENV PYTHONDONTWRITEBYTECODE=1
# Keeps Python from buffering stdout and stderr to avoid situations where
# the application crashes without emitting any logs due to buffering.
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Create a non-privileged user that the app will run under.
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

# Install S3 dependencies
RUN apt-get update -y && \
  apt-get install -y \
    wget \
    tar \
    git \
    unzip &&
    apt-get clean

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.cache/pip to speed up subsequent builds.
# Leverage a bind mount to requirements.txt to avoid having to copy them into
# into this layer.
RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=algo/,target=algo/ \
    python -m pip install numpy # <-- install your algorithm

# Switch to the non-privileged user to run the application.
USER appuser

VOLUME ["/data"]
VOLUME ["/output"]

# Define input / output files
ENV INPUT=""
ENV OUTPUT=""
# Run the application
# NOTE: edit the second command
CMD python3 -m algo "/data/${INPUT}" "/output/${OUTPUT}"
