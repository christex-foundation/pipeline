export async function clearServiceWorkerCache(pattern = 'ALL') {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();

      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.success);
      };

      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE', pattern }, [
        messageChannel.port2,
      ]);
    });
  }
}

// Usage examples:
// await clearServiceWorkerCache(); // Clear all
// await clearServiceWorkerCache('/api/projects'); // Clear API caches
// await clearServiceWorkerCache('bookmark'); // Clear bookmark-related caches
