#!/usr/bin/env bash

if ! [ -x "$(command -v jq)" ]; then
  echo 'Error: jq is not installed.' >&2
  exit 1
fi

LIST=$(grep -E "(Yes|No)" lib/CharacteristicName.csv | sed 's/,Yes.*//' | sed 's/,No.*//' | sed 's/"//g')
JSON=$(jq -ncR '[inputs]' <<< "$LIST")

cat << EOF > src/definitions.enum-characteristic-name.json
{
    "CharacteristicName": {
      "\$ref": "../node_modules/wqx/json-schema/definitions.json#/CharacteristicName",
      "enum": ${JSON}
    }
}
EOF
