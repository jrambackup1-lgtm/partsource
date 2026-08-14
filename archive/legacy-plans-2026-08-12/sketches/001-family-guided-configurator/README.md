## Variant: Family guided configurator

### Design stance

Treat the family page as a constraint-aware configuration builder that progressively narrows valid technical choices.

### Key choices

- Layout: one family header, sequential attribute stages, sticky selected-configuration summary.
- Typography: existing PartSource type and color system.
- Color: restrained slate with blue only for parsed search intent.
- Interaction: pick thread/material/length/standard, load a known identifier, add the configuration to a local BOM.

### Trade-offs

- Strong at: onboarding, preventing invalid combinations, showing how the search intent becomes a configuration.
- Weak at: slower comparison across many near-identical rows and less efficient for expert bulk scanning.

### Best for

Users starting from imperfect descriptions or users who need help identifying the correct mechanical configuration.
