const fs = require('fs');
const base64 = fs.readFileSync('original_base64.txt', 'utf8').replace(/\s+/g, '');
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <style>
      .icon {
        /* Light mode: Keep the original black */
        filter: none;
      }
      @media (prefers-color-scheme: dark) {
        .icon {
          /* Dark mode: Invert to white */
          filter: invert(1);
        }
      }
    </style>
  </defs>
  <image class="icon" href="data:image/png;base64,${base64}" x="0" y="0" width="128" height="128"/>
</svg>`;
fs.writeFileSync('public/favicon.svg', svg);
