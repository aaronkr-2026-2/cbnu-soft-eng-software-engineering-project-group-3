# UI Component Guide

Version: 0.1

Updated: 2026-09-18

Ant Design is the project's standard UI library. Its components provide the shared behavior, accessibility baseline, theme-token integration, and responsive structure for ordinary product UI. The app uses `ConfigProvider` theme tokens rather than introducing a second design system.

## Component choices

| Need                                      | Default choice                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------------- |
| Application shell                         | `Layout`, `Header`, `Sider`, `Content`, and `Footer` when required              |
| Simple horizontal or vertical arrangement | `Flex`; use `Space` for a compact sequence of controls                          |
| Form controls and validation              | `Form`, `Input`, `Select`, `Checkbox`, `Radio`, `Switch`, and `Button`          |
| Generic grouped surface                   | `Card`                                                                          |
| Status, confirmation, and errors          | `Alert`, `Tag`, `Progress`, `Message`, `Notification`, `Modal`, or `Popconfirm` |
| Navigation                                | `Menu`, `Breadcrumb`, `Tabs`, `Dropdown`, or `Pagination` as appropriate        |
| Responsive columns                        | `Grid`, `Row`, and `Col` when the layout is ordinary application content        |

## When custom markup and CSS are appropriate

Use semantic HTML and focused custom CSS where Ant Design has no product-specific component or where its abstraction would make the subtitle editor less correct or less responsive. Current examples are the SRT file drop target, preserved inline subtitle markup, paired cue treatment, continuation-group indicator, quality-review details, and off-screen cue rendering containment.

Custom CSS may set product identity and layout behavior around Ant Design components. It must not recreate a standard button, select, alert, card, page shell, or generic spacing wrapper that Ant Design already supplies. Prefer an Ant Design component first, then add the smallest class-level styling needed for the SRT Translator's appearance and behavior.

The long subtitle review list uses `@tanstack/react-virtual` because Ant Design does not provide a variable-height virtual list with retained editing rows. It is a focused performance dependency: it measures cue rows, mounts the viewport plus a small buffer, and lets the app scroll to the active translation cue.

Inspect the rendered DOM when styling an Ant Design composite component. `Sider` wraps its supplied content in `.ant-layout-sider-children`; sidebar gaps and the bottom action region belong on that actual layout container. The desktop translator uses 20 px between major controls, a stationary action group below the scrollable sidebar controls, and a compact sticky preview/column-label header in the content pane.

## Review check

Before adding a `div` solely for layout or a new general-purpose styled panel, check the relevant Ant Design component documentation. Explain any intentional custom structure in the code or review description when its reason is non-obvious.
