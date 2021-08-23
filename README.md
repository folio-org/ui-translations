# ui-translations

Copyright (C) 2020 The KnowledgeWare Technologies Devolopers Team.

This software is distributed under the terms of the Apache License, Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

* [Introduction](#introduction)
* [Workflow](#workflow)
* [Run translations app](#run-translations-app)
* [Run the tests](#run-the-tests)
* [Prerequisites](#prerequisites)
* [Jira Related Issues Links](#jira-related-issues-links)


## Introduction
Each FOLIO installation has lists of controlled vocabulary terms (for instance, “Formats” and “Resource types” in Inventory, “Patron Groups” and “Refund Reasons” in Users — see [FOLIO-2802](https://issues.folio.org/browse/FOLIO-2802) for a more complete list).  In installations that use more than one language, these terms do not display translated values when the locale of the session is changed.<br />
So we need a mechanism for translating and managing the translations of the controlled vocabulary terms in the Settings app and all stripes apps that contain controlled vocabularies so that translators can perform the translation work of the controlled vocabulary terms.

# I'm a back-end developer - what are the required changes to enable the translations of library-defined controlled vocabularies?
The approach to translating library-defined controlled vocabularies does not require any modifications to the backends of any stripes app, so as a backend developer you do not need to make any modifications to your backend module.

# I'm a front-end developer - what are the required changes to enable the translations of library-defined controlled vocabularies?<br />
1- Install [ui-translations](https://github.com/folio-org/ui-translations) and [mod-translations](https://github.com/folio-org/mod-translations) to be able to translate and save your controlled vocabularies.<br />
2- On the components that enables the end users to enter the library-defined controlled vocabularies such as:
 [ControlledVocab component](https://github.com/folio-org/stripes-smart-components/tree/master/lib/ControlledVocab) or [EntryManager component](https://github.com/folio-org/stripes-smart-components/tree/master/lib/EntryManager), you must pass three properties:<br />
   |  name                         |  type           |   desc                                                           | example                                         |
   | ------------------------------|-----------------|------------------------------------------------------------------|--------------------------------------------------
   | appName                       | string          | Specify the app name which contains the controlled vocabularies  | "ui-inventory"                                  |
   | tableName                     | string          | Specify the resource name which contains the controlled vocabulary| "materialTypes" or "instanceTypes" if you are in inventory app                                                |
   | translatableFields            | array of strings|   Array of fields to be translatable.                            | ["name", "desc"]                                |
   
See this [PR](https://github.com/folio-org/ui-inventory/pull/1440/files#diff-582f754713eebc811832e763a1a0f2730b0a5905ad1b31532b5bd87dd50db207L29) which enables the translations of the library-defined controlled vocabularies on the material types table.<br />
3- On your app replace the fetched controlled vocabularies with their own translation key (The translation key can be found by the translation app). See this [PR](https://github.com/folio-org/ui-inventory/pull/1440/files#diff-685dca1b8d6f613c288a3b1a108fd21f7d475f5c39030f4a8227c8173ac6eb86L53) for enabling the translations of controlled vocabularies on the inventory app filters.

# I'm a translator - what do I need to translate the library-defined controlled vocabularies?<br />
As a translator, you must be assigned as a translator for a specific language from the translation app settings, and then you can go to the application interface, choose your language and start your translation process.

## Workflow
See the workflow for translating library-defined controlled vocabularies from [here]().
Also see [Thinking about multilingual schema]() to learn about the ideas that have been raised, the challenges corresponding to their implementation, and the decisions that led us to take this path in translating library-defined controlled vocabularies.

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

Install okapi-cli:
```
apt-get install -y ruby
gem install okapi
```

Generate a ui module descriptor <br />
This can be done using a script provided with stripes-core (and which is used in back-end deployment):
```
node util/package2md.js package.json > MD.json
```

Add the ui module descriptor to Okapi<br />
You can POST the descriptor using any HTTP client utility, such as curl, for example:
```
curl localhost:9130/_/proxy/modules -d @MD.json
```
Set okapi url:
```
okapi config:set OKAPI_URL=http://localhost:9130
```
Associate the module with the tenant
```
echo "{`sed -n '/"id":/s/,$//p' MD.json`}" | okapi --no-tenant create /_/proxy/tenants/kware_test/modules
```

## Jira Related Issues Links
https://issues.folio.org/browse/UXPROD-3148 <br />
https://issues.folio.org/browse/FOLIO-3258 <br />
https://issues.folio.org/browse/UXPROD-515 <br />
