# Privacy Data Map

| Data | Location | Purpose | Routine logs | Default retention |
|---|---|---|---|---|
| Anonymous app ID | Device secure storage; API subject mapping later | Stable anonymous identity | Hashed only | Until deletion/reset |
| Raw microphone audio | Active WebRTC media path | Live roleplay | Never | Not retained |
| Transcript turns | Device memory/local storage | Feedback and history | Never | Local until user deletes |
| Transcript sent for evaluation | API process memory and provider request | Structured coaching | Never | Not persisted by API |
| Custom context | Device and transient provider request | Scenario relevance | Never | Local until user deletes |
| Request/trace IDs | Mobile diagnostic trail and API logs | Debugging | Yes | Operational policy TBD |
| AI usage metadata | API metrics | Cost/reliability | Yes | Operational policy TBD |

The application must not claim that voice or transcript data stays entirely on-device. Provider
processing and final production retention controls must be disclosed accurately.
