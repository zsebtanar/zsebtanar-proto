#!/usr/bin/env bash

# To set up admin credentials for emulated functions:
#
# 1) Open the Service Accounts pane of the Google Cloud Console. https://console.cloud.google.com/iam-admin/serviceaccounts
# 2) Make sure that App Engine default service account is selected, and use the options menu at right to select Create key.
# 3) When prompted, select JSON for the key type, and click Create.
# 4) Set your Google default credentials to point to the downloaded key:
#
# More info here:
# https://firebase.google.com/docs/functions/local-emulator

set -e

export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/tools/key.json"

firebase emulators:start --only functions
