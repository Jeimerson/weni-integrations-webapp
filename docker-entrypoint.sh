#!/bin/sh
export JSON_STRING='window.configs = { \
  "VUE_APP_API_BASE_URL":"'${VUE_APP_API_BASE_URL}'", \
  "VUE_APP_USE_SENTRY":"'${VUE_APP_USE_SENTRY}'", \
  "VUE_APP_SENTRY_DSN":"'${VUE_APP_SENTRY_DSN}'", \
  "VUE_APP_FACEBOOK_APP_ID":"'${VUE_APP_FACEBOOK_APP_ID}'", \
  "VUE_APP_WHATSAPP_FACEBOOK_APP_ID":"'${VUE_APP_WHATSAPP_FACEBOOK_APP_ID}'", \
  "VUE_APP_LOGROCKET_ID":"'${VUE_APP_LOGROCKET_ID}'", \
  "VUE_APP_PARENT_IFRAME_DOMAIN":"'${VUE_APP_PARENT_IFRAME_DOMAIN}'", \
  "VUE_APP_HELPHERO_ID":"'${VUE_APP_HELPHERO_ID}'", \
  "VUE_APP_FLOWS_IFRAME_URL":"'${VUE_APP_FLOWS_IFRAME_URL}'", \
}'
sed -i "s|//CONFIGURATIONS_PLACEHOLDER|${JSON_STRING}|" /usr/share/nginx/html/integrations/index.html

exec "$@"