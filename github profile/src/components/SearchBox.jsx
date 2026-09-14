import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";

// Simple debounce hook
function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function GithubSearchBox({ setData }) {
  const [query, setQuery] = useState("github");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const abortRef = useRef(null);
  const containerRef = useRef(null);

  const debouncedQuery = useDebouncedValue(query, 400);

  const runSearch = useCallback(async (q) => {
    if (!q || q.trim().length < 1) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    // Cancel any in-flight request for a stale query
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const searchRes = await fetch(
        `https://api.github.com/search/users?q=${encodeURIComponent(
          q,
        )}&per_page=10`,
        {
          signal: controller.signal,
          headers: { Accept: "application/vnd.github+json" },
        },
      );

      if (!searchRes.ok) {
        if (searchRes.status === 403) {
          throw new Error("Rate limit reached. Try again in a minute.");
        }
        throw new Error("Search failed. Please try again.");
      }

      const searchData = await searchRes.json();
      const items = searchData.items || [];

      // Fetch full profile for each result to get the bio/description
      const detailed = await Promise.all(
        items.map((item) => {
          // Fall back to the basic search result if the profile fetch fails
          return {
            id: item.id,
            login: item.login,
            avatar_url: item.avatar_url,
            html_url: item.html_url,
            name: item.login,
            bio: "",
            url: item.url,
            repos_url: `${item.repos_url}?per_page=4`,
          };
        }),
      );

      setResults(detailed);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Something went wrong.");
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    runSearch(debouncedQuery);
  }, [debouncedQuery, runSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      {/* Search input */}
      <div className="flex items-center gap-3 rounded-xl bg-background px-4 py-3 ">
        <Search className="w-4 h-4 text-muted shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search GitHub users..."
          className="w-full bg-transparent text-slate-100 placeholder-muted outline-none text-sm"
        />
        {loading && (
          <Loader2 className="w-4 h-4 text-muted animate-spin shrink-0" />
        )}
      </div>

      {/* Dropdown */}
      {open && query.trim().length > 0 && (
        <div className="absolute mt-2 w-full rounded-xl bg-search-dropdown-bg  overflow-hidden z-10">
          {error && <div className="px-4 py-3 text-sm text-error">{error}</div>}

          {!error && !loading && results.length === 0 && (
            <div className="px-4 py-3 text-sm text-muted">No users found.</div>
          )}

          {!error && results.length > 0 && (
            <ul className="max-h-80 overflow-y-auto divide-y divide-slate-700/50">
              {results.map((user) => (
                <li key={user.id}>
                  <div
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700/40 transition-colors"
                    onClick={() => {
                      console.log(user);
                      setOpen(false);
                      setData(user.url, user.repos_url);
                    }}
                  >
                    <img
                      src={user.avatar_url}
                      alt={user.login}
                      className="w-10 h-10 rounded-lg shrink-0 bg-slate-700"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-100 truncate">
                        {user.name}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
