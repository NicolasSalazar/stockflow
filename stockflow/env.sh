#!/bin/sh
# env.sh - Inject runtime environment variables into the React app

# Create env-config.js file with environment variables
cat <<EOF > /usr/share/nginx/html/env-config.js
window.ENV = {
  VITE_PRODUCTS_API_URL: "${VITE_PRODUCTS_API_URL}",
  VITE_STOCKS_API_URL: "${VITE_STOCKS_API_URL}"
};
EOF

echo "Environment variables injected successfully"
