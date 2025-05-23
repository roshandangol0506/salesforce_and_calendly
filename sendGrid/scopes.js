// sendgridScopes.js

const scopes = [
  // API Keys
  "api_keys.create",
  "api_keys.read",
  "api_keys.update",
  "api_keys.delete",

  // Alerts
  "alerts.create",
  "alerts.read",
  "alerts.update",
  "alerts.delete",

  // Categories
  "categories.read",
  "categories.create",
  "categories.delete",

  // Design Library (Templates)
  "templates.create",
  "templates.read",
  "templates.update",
  "templates.delete",

  // Email Activity
  "messages.read",

  // Email Testing
  "email_tests.create",
  "email_tests.read",

  // IP Management
  "ips.read",

  // Inbound Parse
  "inbound_parse.create",
  "inbound_parse.read",
  "inbound_parse.update",
  "inbound_parse.delete",

  // Mail Send
  "mail.send",

  // Mail Settings
  "mail_settings.read",
  "mail_settings.update",

  // Marketing
  "marketing.contacts.read",
  "marketing.contacts.write",
  "marketing.lists.read",
  "marketing.lists.write",
  "marketing.segments.read",
  "marketing.segments.write",
  "marketing.singlesends.read",
  "marketing.singlesends.write",
  "marketing.schedules.read",
  "marketing.schedules.write",
  "marketing.test.send",
  "marketing.stats.read",

  // Partners
  "partner.settings.read",
  "partner.settings.update",

  // Recipients Data Erasure
  "recipients.remove",

  // Security
  "whitelabel.domains.read",
  "whitelabel.domains.create",
  "whitelabel.domains.update",
  "whitelabel.domains.delete",

  // Sender Authentication
  "senders.read",
  "senders.create",
  "senders.update",
  "senders.delete",

  // Stats
  "stats.read",

  // Suppressions
  "suppression.suppressions.read",
  "suppression.suppressions.update",
  "suppression.suppressions.delete",

  // Template Engine
  "template_engine.templates.create",
  "template_engine.templates.read",
  "template_engine.templates.update",
  "template_engine.templates.delete",

  // Tracking
  "tracking_settings.read",
  "tracking_settings.update",

  // User Account
  "user.profile.read",
  "user.profile.update",
  "user.settings.read",
  "user.settings.update",
];

module.exports = scopes;
