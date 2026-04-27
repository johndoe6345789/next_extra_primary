/**
 * Applies hydration fixes to Next.js 16 internals after npm install.
 *
 * Four patches to node_modules/next/dist/client/app-index.js:
 * 1. Defer RSC stream close to window.onload (prevents "Connection closed"
 *    error when Turbopack compiles async chunks after DOMContentLoaded).
 * 2. Remove nextServerDataLoadingGlobal.length = 0 (HMR re-executes
 *    app-index.js; clearing the array loses buffered RSC data).
 * 3. Remove debugChannel from createFromReadableStream (dual-stream EOF
 *    gate prevents close() from firing, leaving hydration suspended).
 * 4. Add __next_hydrated guard to hydrate() (HMR re-executions must not
 *    call hydrateRoot a second time).
 */

'use strict';

const fs = require('fs');
const path = require('path');

const FILE = path.join(
  __dirname,
  '..',
  'node_modules/next/dist/client/app-index.js',
);

let src = fs.readFileSync(FILE, 'utf8');
let changed = false;

function apply(description, from, to) {
  if (!src.includes(from)) {
    console.log('SKIP (already applied or source changed): ' + description);
    return;
  }
  src = src.replace(from, to);
  console.log('OK: ' + description);
  changed = true;
}

// 1. Defer stream close to window.onload
apply(
  'defer RSC stream close to window.onload',
  [
    '    if (initialServerDataWriter && !initialServerDataFlushed) {',
    '        initialServerDataWriter.close();',
    '        initialServerDataFlushed = true;',
    '        initialServerDataBuffer = undefined;',
    '    }',
  ].join('\n'),
  [
    '    if (initialServerDataWriter && !initialServerDataFlushed) {',
    '        const doClose = () => {',
    '            if (!initialServerDataFlushed) {',
    '                initialServerDataWriter.close();',
    '                initialServerDataFlushed = true;',
    '                initialServerDataBuffer = undefined;',
    '            }',
    '        };',
    '        if (document.readyState === \'complete\') {',
    '            doClose();',
    '        } else {',
    '            window.addEventListener(\'load\', doClose, { once: true });',
    '        }',
    '    }',
  ].join('\n'),
);

// 2. Remove length = 0 (prevents HMR re-execution from losing RSC data)
apply(
  'remove nextServerDataLoadingGlobal.length = 0',
  'nextServerDataLoadingGlobal.forEach(nextServerDataCallback);\n' +
    'nextServerDataLoadingGlobal.length = 0;\n',
  'nextServerDataLoadingGlobal.forEach(nextServerDataCallback);\n',
);

// 3. Remove debugChannel from the main createFromReadableStream call
apply(
  'remove debugChannel from createFromReadableStream',
  [
    '    initialServerResponse = createFromReadableStream(readable, {',
    '        callServer: _appcallserver.callServer,',
    '        findSourceMapURL: _appfindsourcemapurl.findSourceMapURL,',
    '        debugChannel,',
    '        startTime: 0',
    '    });',
  ].join('\n'),
  [
    '    initialServerResponse = createFromReadableStream(readable, {',
    '        callServer: _appcallserver.callServer,',
    '        findSourceMapURL: _appfindsourcemapurl.findSourceMapURL,',
    '        startTime: 0',
    '    });',
  ].join('\n'),
);

// 5. RSC client: replace reportGlobalError on close with _closed flag.
//    When the RSC stream closes with _pendingChunks > 0 (Turbopack modules
//    still compiling), the original code throws "Connection closed." via
//    reportGlobalError. Setting _closed = true instead lets the pending
//    chunks resolve naturally once Turbopack finishes compiling them.
const RSC_CLIENT = path.join(
  __dirname,
  '..',
  'node_modules/next/dist/compiled/react-server-dom-turbopack/cjs/' +
    'react-server-dom-turbopack-client.browser.development.js',
);
let rscSrc = fs.readFileSync(RSC_CLIENT, 'utf8');
let rscChanged = false;
const rscFrom =
  '          : reportGlobalError(weakResponse, Error("Connection closed."));';
// Only mark _closed when all chunks are already resolved (_pendingChunks===0).
// If chunks are still pending, do nothing: Turbopack resolves them via its
// registry; getChunk keeps returning pending chunks until they resolve.
// Setting _closed with pending chunks causes getChunk to create
// null-rejected ReactPromises, which surface as thrown null in ErrorBoundary.
const rscTo =
  '          : (0 === response._pendingChunks ? (response._closed = !0) : void 0);\n' +
  '        // If _pendingChunks > 0, skip _closed — getChunk creates pending\n' +
  '        // chunks that Turbopack resolves via its registry.';
if (rscSrc.includes(rscFrom)) {
  rscSrc = rscSrc.replace(rscFrom, rscTo);
  rscChanged = true;
  console.log('OK: replace reportGlobalError with _closed in RSC client');
} else {
  console.log('SKIP (already applied or source changed): RSC client _closed fix');
}
if (rscChanged) {
  fs.writeFileSync(RSC_CLIENT, rscSrc);
  console.log('Wrote patched react-server-dom-turbopack-client');
}

// 4. Add __next_hydrated guard to prevent double hydration on HMR
apply(
  'add __next_hydrated guard to hydrate()',
  'async function hydrate(instrumentationHooks, assetPrefix) {\n' +
    '    let staticIndicatorState;',
  'async function hydrate(instrumentationHooks, assetPrefix) {\n' +
    '    if (self.__next_hydrated) return;\n' +
    '    self.__next_hydrated = true;\n' +
    '    let staticIndicatorState;',
);

if (changed) {
  fs.writeFileSync(FILE, src);
  console.log('Wrote patched app-index.js');
} else {
  console.log('No changes needed to app-index.js');
}

// 6. RSC router state: return undefined on validation failure
//    instead of throwing E10. Navigating between route groups
//    (e.g. (dashboard) → /forum) sends stale __DEFAULT__:{} state
//    that fails superstruct validation; returning undefined triggers
//    a full-page render as fallback instead of a 500.
const FLIGHT_ROUTER_STATE = path.join(
  __dirname,
  '..',
  'node_modules/next/dist/server/app-render/' +
    'parse-and-validate-flight-router-state.js',
);
let routerSrc = fs.readFileSync(FLIGHT_ROUTER_STATE, 'utf8');
const routerFrom =
  "throw Object.defineProperty(new Error(" +
  "'The router state header was sent but could not be parsed.')" +
  ", \"__NEXT_ERROR_CODE\", {\n" +
  "            value: \"E10\",\n" +
  "            enumerable: false,\n" +
  "            configurable: true\n" +
  "        });";
const routerTo = 'return undefined;';
if (routerSrc.includes(routerFrom)) {
  routerSrc = routerSrc.replace(routerFrom, routerTo);
  fs.writeFileSync(FLIGHT_ROUTER_STATE, routerSrc);
  console.log('OK: router state validation returns undefined on failure');
} else {
  console.log(
    'SKIP (already applied or source changed): ' +
    'router state validation fix',
  );
}
