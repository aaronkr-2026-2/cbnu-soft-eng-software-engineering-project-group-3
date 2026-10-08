# UI Component Guide

Version: 0.2

Updated: 2026-10-08

Ant Design is the project's standard UI library. Its components provide the shared behavior, accessibility baseline, theme-token integration, and responsive structure for ordinary product UI. The app uses `ConfigProvider` theme tokens rather than introducing a second design system.

## Component choices

| Need                                      | Default choice                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------------- |
| Application shell                         | `Layout`, `Header`, `Sider`, `Content`, and `Footer` when required              |
| Simple horizontal or vertical arrangement | `Flex`; use `Space` for a compact sequence of controls                          |
| Form controls and validation              | `Form`, `Input`, `Select`, `Checkbox`, `Radio`, `Switch`, and `Button`          |
| Generic grouped surface                   | `Card`                                                                          |
| Status, confirmation, errors, and help    | `Alert`, `Tag`, `Progress`, `Message`, `Notification`, `Modal`, `Popconfirm`, `Tooltip`, or `Popover` |
| Navigation                                | `Menu`, `Breadcrumb`, `Tabs`, `Dropdown`, or `Pagination` as appropriate        |
| Responsive columns                        | `Grid`, `Row`, and `Col` when the layout is ordinary application content        |

## When custom markup and CSS are appropriate

Use semantic HTML and focused custom CSS where Ant Design has no product-specific component or where its abstraction would make the subtitle editor less correct or less responsive. Current examples are preserved inline subtitle markup, paired cue treatment, continuation-group indicators and measured virtual-row positioning. File selection/drop now uses `Upload.Dragger`; feedback uses `Alert`.

Custom CSS may set product identity and layout behavior around Ant Design components. It must not recreate a standard button, select, alert, card, page shell, or generic spacing wrapper that Ant Design already supplies. Prefer an Ant Design component first, then add the smallest class-level styling needed for the SRT Translator's appearance and behavior.

The long subtitle review list uses `@tanstack/react-virtual` because Ant Design does not provide a variable-height virtual list with retained editing rows. It is a focused performance dependency: it measures cue rows, mounts the viewport plus a small buffer, and lets the app scroll to the active translation cue.

Inspect the rendered DOM when styling an Ant Design composite component. `Sider` wraps its supplied content in `.ant-layout-sider-children`; sidebar gaps and the bottom action region belong on that actual layout container. The desktop translator uses 24 px between major controls, a stationary action group below the scrollable sidebar controls, and a compact sticky preview/column-label header in the content pane.

Composite feedback must also be checked at its real child boundaries. Ant Design 6 renders descriptive Alert content in `.ant-alert-section` and its action in `.ant-alert-actions`. In the narrow translator sidebar, keep the icon and readable message together and place a long retry action on a full-width row below them. Give flex/grid children `min-width: 0`, wrap dynamic feedback text, and verify both component-level and document-level horizontal overflow at desktop and mobile widths. Do not apply an unscoped rule to every `div` or replace Alert with a custom panel.

`Upload.Dragger` also renders an internal drag container. Loaded filenames must be constrained on that actual container: use safe anywhere-wrapping with a bounded visible line count, and keep the complete name available through a tooltip. Do not let a local filename widen or escape the sidebar.

Use a `Tooltip` for a short label such as the next theme action. Use a `Popover` for compact optional help that needs a sentence or two, with a deliberate reading width. Use a `Modal` only for a workflow explanation that merits focused reading; give it the minimum necessary action buttons.

## Review check

Before adding a `div` solely for layout or a new general-purpose styled panel, check the relevant Ant Design component documentation. Explain any intentional custom structure in the code or review description when its reason is non-obvious.

## Shared theme and spacing

`frontend/src/app/theme.ts` exports the global/component configuration consumed by `ConfigProvider` in App. Use token overrides for shared color, font, radius and component padding. Use `theme.useToken` for custom surfaces; layout-specific class rules and measured style props remain appropriate. This follows [Ant Design theme guidance](https://ant.design/docs/react/customize-theme/).

Use an 8 px spacing base with 8/16/24/32 px for close relationships, card/layout spacing, major controls and scroll-end breathing room. The 24 px sidebar gap replaces the earlier isolated 20 px rule. This is a project scale informed by [Ant Design layout guidance](https://ant.design/docs/spec/layout/), not a universal requirement that every element have identical padding. Keep the deliberately narrow preview gutter.

Initialize theme from the OS at page load and retain the user's explicit switch choice for that mounted session. Do not add a decorative switch dependency when existing icons/Tooltip communicate its purpose.
