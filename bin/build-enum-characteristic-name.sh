#!/usr/bin/env bash

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
