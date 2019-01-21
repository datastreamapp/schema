#!/usr/bin/env bash

LIST=$(grep "Yes" lib/CharacteristicName.csv | sed 's/,Yes.*//' | sed 's/"//g')
JSON=$(jq -ncR '[inputs]' <<< "$LIST")

# If one of the following characteristic name, then sample fraction is required
cat << EOF > src/definitions.switch-if-characteristic-name.json
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
