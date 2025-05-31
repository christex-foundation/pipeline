/// <reference types="./service-worker.d.ts" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = self;

import { build, files, version } from '$service-worker';

// Create cache names for this deployment
const CACHE = `cache-${version}`;
const IMAGE_CACHE = `images-${version}`;

// Assets to cache immediately (critical resources)
const ASSETS = [
  ...build, // the app itself
  ...files, // everything in static
];

// Image file extensions to aggressively cache
const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|svg|avif|ico)$/i;

sw.addEventListener('install', (event) => {
  // Create a new cache and add all files to it
  async function addFilesToCache() {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  }

  event.waitUntil(addFilesToCache());
});

sw.addEventListener('activate', (event) => {
  // Remove previous cached data from disk
  async function deleteOldCaches() {
    for (const key of await caches.keys()) {
      if (key !== CACHE && key !== IMAGE_CACHE) {
        await caches.delete(key);
      }
    }
  }

  event.waitUntil(deleteOldCaches());
});

sw.addEventListener('fetch', (event) => {
  // Ignore POST requests etc
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Handle images aggressively (cache-first strategy)
  if (IMAGE_EXTENSIONS.test(url.pathname)) {
    event.respondWith(handleImageRequest(event.request));
    return;
  }

  // Handle other requests with network-first strategy
  event.respondWith(handleGeneralRequest(event.request));
});

// Aggressive image caching - cache first, network fallback
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);

  // Try cache first for images
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // If not in cache, fetch from network and cache aggressively
  try {
    const response = await fetch(request);

    if (response.status === 200) {
      // Clone the response before caching (can only read once)
      const responseClone = response.clone();

      // Cache the image with no expiration concerns - be aggressive
      cache.put(request, responseClone);
    }

    return response;
  } catch (error) {
    // If network fails, return a fallback or the error
    throw error;
  }
}

// Network-first strategy for non-image requests
async function handleGeneralRequest(request) {
  const url = new URL(request.url);
  const cache = await caches.open(CACHE);

  // serve build files from the cache first
  if (ASSETS.includes(url.pathname)) {
    const response = await cache.match(request);

    if (response) {
      return response;
    }
  }

  // try the network first, then cache
  try {
    const response = await fetch(request);

    // if we're offline, fetch can return a value that is not a Response
    // instead, it should return a promise that rejects, but no browsers
    // currently do this correctly
    if (!(response instanceof Response)) {
      throw new Error('invalid response from fetch');
    }

    if (response.status === 200) {
      cache.put(request, response.clone());
    }

    return response;
  } catch (err) {
    // try the cache
    const response = await cache.match(request);

    if (response) {
      return response;
    }

    // if there's no cache, then return the error
    throw err;
  }
}
