#!/bin/bash
# @see https://cli.github.com/manual/gh_release_create

export VERSION=v$(grep '"version"' package.json | grep -Eo '[0-9\.]+')
export NOTES=$(git log | grep 'Updating rules/prefixes.json' | head -n 1 | sed "s/    //g")

echo "Creating a GitHub release for tag ${VERSION} (with notes '${NOTES}') ..."

set -x
gh auth login --with-token ${GITHUB_TOKEN}
gh release create $VERSION --title 'Updating prefixes data'  --notes "${NOTES}"
