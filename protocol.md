# Protocol

All data that is passed between client and server is passed as JSON.

This is what the JSON must look like:

```json
{
  "eventName": "String",
  "args": ["String"]
}
```

The entire json object will be passed into `JSON.parse`.

* `eventName` is the name of the event that has been emitted.
* `args` are all of the arguments emitted. This array must contain valid JSON strings. 