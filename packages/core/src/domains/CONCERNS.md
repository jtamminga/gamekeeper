# Domain Concerns

## 1. Goal requires explicit load() before progress is accessible

`Goal.load()` must be called after construction to populate `progress` (it's async).
Accessing `progress` before `load()` throws at runtime. This two-phase initialization
pattern is easy to misuse. Consider whether goals could be fully initialized at
construction time, or whether the unloaded state should be represented in the type
(e.g. `progress: number | undefined` rather than a runtime throw).
