+++
slug = ""
description = ""
tags = [""]
categories = [""]
draft = true
date = 2020-01-10T16:30:21+01:00
title = "Elastic Error for Long Integers"
software_versions = [""]
+++

```
failed to create query: {
  "bool" : {
    "must" : [
      {
        "bool" : {
          "should" : [
            {
              "match" : {
                "itemid" : {
                  "query" : 3456734567,
                  // ... cut for brevity
                }
              }
            },
            {
              "match" : {
                "itemdescription" : {
                  "query" : "3456734567",
                  // ... cut for brevity
                }
              }
            }
          ],
        }
      }
    ],
  }
} [index: items] [reason: all shards failed]
```

```
{
   "error" : {
      "grouped" : true,
      "phase" : "query",
      "caused_by" : {
         "caused_by" : {
            "reason" : "For input string: \"3456734567\"",
            "type" : "number_format_exception"
         },
         "type" : "query_shard_exception",
         "reason" : "failed to create query: {\n  \"query_string\" : {\n    \"query\" : \"itemid:3456734567\" }\n}",
         "index" : "items"
      },
      "type" : "search_phase_execution_exception",
      "root_cause" : [
         {
            "index_uuid" : "icAO91V6RV2wfx4z5iuKKA",
            "type" : "query_shard_exception",
            "reason" : "failed to create query: {\n  \"query_string\" : {\n    \"query\" : \"itemid:3456734567\" }\n}",
            "index" : "items"
         }
      ],
      "failed_shards" : [
         {
            "shard" : 0,
            "reason" : {
               "reason" : "failed to create query: {\n  \"query_string\" : {\n    \"query\" : \"itemid:3456734567\" }\n}",
               "index" : "items",
               "type" : "query_shard_exception",
               "caused_by" : {
                  "reason" : "For input string: \"3456734567\"",
                  "type" : "number_format_exception"
               },
               "index_uuid" : "icAO91V6RV2wfx4z5iuKKA"
            },
            "node" : "LNrqWvlfTAumCuZGZqsXKw",
            "index" : "items"
         }
      ],
      "reason" : "all shards failed"
   },
   "status" : 400
}
```
