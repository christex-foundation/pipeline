import { writable } from 'svelte/store';

export const projectStore = writable({
  title: '',
  bio: '',
  tags: [],
  country: '',
  details: '',
  email: '',
  portfolio: '',
  github_repo: '',
  linkedin: '',
  twitter: '',
  website: '',
  other: '',
  funding_goal: '',
  bank_acct: '',
  wallet_address: '',
  banner_image: '',
  image: '',
});
