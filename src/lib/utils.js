import { writable } from "svelte/store";

// utils.js
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
  

 export let searchBarOpen = writable(false);