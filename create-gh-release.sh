#!/bin/bash
# @see https://cli.github.com/manual/gh_release_create

export VERSION=v$(npm ls --json | jq .version | sed 's/"//g')
export NOTES=$(git log | grep 'Updating rules/prefixes.json' | head -n 1 | sed "s/    //g")

echo "::notice::Creating a GitHub release for tag ${VERSION} (with notes '${NOTES}') ..."

set -x
gh release create $VERSION --title "${VERSION}: updating prefixes data"  --notes "${NOTES}" && echo "::notice::Done" || echo "::error::Failed"
