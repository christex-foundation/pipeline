//@ts-check
import { Queue, Worker } from 'bullmq';
import { redisHost, redisPort, redisPassword } from '$lib/server/config.js';

/**
 * @typedef {Object} QueueHandle
 * @property {(jobName: string, data: any) => Promise<void>} add - Add a job to the queue
 */

/**
 * Creates a BullMQ-backed queue.
 * @param {string} name - Queue name
 * @returns {QueueHandle}
 */
export function createQueue(name) {
  const queue = new Queue(name, {
    connection: {
      host: redisHost,
      // @ts-ignore
      port: redisPort,
      password: redisPassword,
    },
  });

  return {
    async add(jobName, data) {
      await queue.add(jobName, data);
    },
  };
}

/**
 * Creates a BullMQ worker that processes jobs from the named queue.
 * @param {string} name - Queue name to listen on
 * @param {(job: { data: any }) => Promise<void>} handler - Job handler function
 * @returns {Worker}
 */
export function createWorker(name, handler) {
  return new Worker(name, handler, {
    connection: {
      host: redisHost,
      port: redisPort,
      password: redisPassword,
    },
  });
}
