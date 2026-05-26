# TestingVial4VisualStudioCode

This is a Visual Studio Code extension to open `.vial` files.

## Current behavior

- Opening a `.vial` file uses the custom **Vial File Viewer**.
- The file content is rendered in a panel with a **5px red border**.
- A search bar appears above the content.
- Clicking **Search** shows a spinner, waits 3 seconds, then displays:
  - `HELLO <search text>`
- The UI already includes tab structure for future iterations:
  - **Raw** (current content view)
  - **Table** (placeholder)
  - **Graph** (placeholder)
