#!/usr/bin/env bash

if ! [ -x "$(command -v jq)" ]; then
  echo 'Error: jq is not installed.' >&2
  exit 1
fi

LIST=$(grep "Yes" lib/CharacteristicName.csv | sed 's/,Yes.*//' | sed 's/"//g')
JSON=$(jq -ncR '[inputs]' <<< "$LIST")

# If one of the following characteristic name, then sample fraction is required
cat << EOF > src/definitions.logic.characteristic-name.json
{
  "properties": {
    "CharacteristicName": {
      "enum": ${JSON}
    }
  },
  "required": [
    "CharacteristicName"
  ]
}
EOF
