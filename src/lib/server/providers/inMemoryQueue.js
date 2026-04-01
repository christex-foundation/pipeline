//@ts-check

/**
 * In-memory queue provider — processes jobs synchronously as a fallback
 * when Redis is not available. Suitable for development and single-instance deployments.
 */

/** @type {Map<string, (job: { data: any }) => Promise<void>>} */
const handlers = new Map();

/**
 * @typedef {Object} QueueHandle
 * @property {(jobName: string, data: any) => Promise<void>} add - Add a job to the queue
 */

/**
 * Creates an in-memory queue that dispatches jobs to a registered handler.
 * @param {string} name - Queue name
 * @returns {QueueHandle}
 */
export function createQueue(name) {
  return {
    async add(jobName, data) {
      const handler = handlers.get(name);
      if (handler) {
        // Process asynchronously to mimic queue behavior
        setTimeout(() => {
          handler({ data }).catch((err) => {
            console.error(`[in-memory-queue] Error processing job "${jobName}":`, err);
          });
        }, 0);
      } else {
        console.warn(`[in-memory-queue] No worker registered for queue "${name}"`);
      }
    },
  };
}

/**
 * Registers a handler for the named queue. Jobs added via createQueue will be
 * dispatched to this handler.
 * @param {string} name - Queue name to listen on
 * @param {(job: { data: any }) => Promise<void>} handler - Job handler function
 * @returns {{ close: () => void }}
 */
export function createWorker(name, handler) {
  handlers.set(name, handler);
  return {
    close() {
      handlers.delete(name);
    },
  };
}
