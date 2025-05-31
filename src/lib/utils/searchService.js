const createSearchService = () => {
  const cache = new Map();
  let abortController = null;

  const manageLRUCache = (key, value) => {
    if (cache.size > 50) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    cache.set(key, value);
  };

  const cancelPreviousRequest = () => {
    abortController?.abort();
    abortController = new AbortController();
    return abortController.signal;
  };

  const fetchProjects = async (term, page, limit) => {
    const signal = cancelPreviousRequest();

    const response = await fetch(`/api/projects?term=${term}&page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal,
    });

    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  };

  const searchProjects = async (term, page = 1, limit = 10) => {
    if (!term?.trim()) return [];

    const cacheKey = `${term}-${page}-${limit}`;
    const cached = cache.get(cacheKey);

    if (cached) return cached;

    try {
      const data = await fetchProjects(term, page, limit);
      manageLRUCache(cacheKey, data.projects);
      return data.projects;
    } catch (e) {
      if (e.name === 'AbortError') return null;
      throw e;
    }
  };

  const clearCache = () => cache.clear();

  return { searchProjects, clearCache };
};

export const searchService = createSearchService();
