export const API_UTILS = {
  config: {
    base: 'https://localhost:7270/api',
    auth: {
      root: 'auth',
      signIn: '/Account/token',
      signUp: 'sign-up',
      forgotPassword: 'forgot-password',
      forgotPasswordEmailSent: 'forgot-password-email-sent',
      passwordReset: 'password-reset',
      passwordResetFailed: 'password-reset-failed',
      passwordResetSucceeded: 'password-reset-succeeded',
    },
    settings: {
      root: 'settings',
      account: 'account',
      appearance: 'appearance',
      billing: 'billing',
      blockedUsers: 'blocked-users',
      notifications: 'notifications',
      security: 'security',
      securityLog: 'security-log',
    },
    fileManager: {
      createFolder: '/FileManager/create-folder'
    },
    account: {
      userDetails: '/Account/user-details',
    },
    errorResponse: {
      notFound: '404',
    },
  },
};
