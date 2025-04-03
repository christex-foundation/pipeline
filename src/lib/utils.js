import { writable } from 'svelte/store';
import { onMount } from 'svelte';
import { fly } from 'svelte/transition';
import { cubicOut } from 'svelte/easing';

export function clickOutside(node, callback) {
  const handleClick = (event) => {
    if (!node.contains(event.target)) {
      callback();
    }
  };

  onMount(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  });
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function flyAndScale(
  node,
  { duration = 150, y = 5, x = 0, start = 0.95, opacity = 0 } = {},
) {
  return {
    duration,
    css: (t) => {
      const eased = cubicOut(t);
      return `
        transform: translate(${(1 - eased) * x}px, ${(1 - eased) * y}px) scale(${start + (1 - start) * eased});
        opacity: ${opacity + eased * (1 - opacity)};
      `;
    },
  };
}

// Store for search bar state
export let searchBarOpen = writable(false);
