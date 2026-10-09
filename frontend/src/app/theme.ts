import { theme, type ThemeConfig } from 'antd';

// Ant Design's 8 px grid: compact relationships / cards / major controls.
export const spacing = { small: 8, medium: 16, large: 24, bottom: 32 } as const;

export function appTheme(dark: boolean): ThemeConfig {
  return {
    algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#42664d',
      borderRadius: 8,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    components: {
      Card: { bodyPaddingSM: spacing.small, headerPaddingSM: spacing.small },
    },
  };
}
