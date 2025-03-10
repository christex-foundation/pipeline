// import { Worker } from 'bullmq';
// import { evaluateProject } from '$lib/server/service/githubWebhookService.js';

// // const projectEvaluationWorker = new Worker('projectEvaluation', async (job) => {
// //     const { github, supabase } = job.data;
// //     console.log(`Processing project evaluation for: ${github}`);

// //     await evaluateProject(github, supabase);
// //     console.log(`Evaluation completed for: ${github}`);
// //   });

// const projectEvaluationWorker = new Worker(
//   'projectEvaluation',
//   async (job) => {
//     try {
//       console.log(`Processing project evaluation for: ${job.data.supabase}`);
//       await evaluateProject(job.data.github, job.data.supabase);
//       console.log(`Evaluation completed for: ${job.data.github}`);
//     } catch (error) {
//       console.error('Worker encountered an error:', error);
//     }
//   },
//   {
//     connection: {
//       host: 'redis-19182.c82.us-east-1-2.ec2.redns.redis-cloud.com',
//       port: 19182,
//       password: 'pHTtGvcnCjIc3nt3sdgOhX3YEaKOC6Ic',
//     },
//   },
// );

// console.log('Project evaluation worker is running...');

