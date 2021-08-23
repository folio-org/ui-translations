# ui-translations

Copyright (C) 2020 The KnowledgeWare Technologies Devolopers Team.

This software is distributed under the terms of the Apache License, Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

* [Introduction](#introduction)
* [Workflow](#workflow)

## Introduction

FOLIO Translations Management Module

## Workflow

## Run translations app

Run the following from the ui-translations directory to serve your new app using a development server:
```
stripes serve
```

Note: When serving up a newly created app that does not have its own backend permissions established, pass the `--hasAllPerms` option to display the app in the UI navigation. For example:
```
stripes serve --hasAllPerms
```

To specify your own tenant ID or to use an Okapi instance other than `http://localhost:9130` pass the `--okapi` and `--tenant` options.
```
stripes serve --okapi http://my-okapi.example.com:9130 --tenant my-tenant-id
```

## Run the tests

Run the included UI tests with the following command:
```
stripes test karma
```

## Prerequisites

# Install okapi-cli:
```
apt-get install -y ruby
gem install okapi
```

# Generate a ui module descriptor
This can be done using a script provided with stripes-core (and which is used in back-end deployment):
```
node util/package2md.js package.json > MD.json
```

# Add the ui module descriptor to Okapi
You can POST the descriptor using any HTTP client utility, such as curl, for example:
```
curl localhost:9130/_/proxy/modules -d @MD.json
```
# Set okapi url:
```
okapi config:set OKAPI_URL=http://localhost:9130
```
# Associate the module with the tenant
```
echo "{`sed -n '/"id":/s/,$//p' MD.json`}" | okapi --no-tenant create /_/proxy/tenants/kware_test/modules
```

