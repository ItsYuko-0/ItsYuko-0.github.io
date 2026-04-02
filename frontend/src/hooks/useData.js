import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";

// Load JSON data
export const useScenes = () => {
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/data/scenes.json")
      .then((res) => res.json())
      .then((data) => {
        setScenes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { scenes, loading, error };
};

export const useCharacters = () => {
  const [characters, setCharacters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/data/characters.json")
      .then((res) => res.json())
      .then((data) => {
        setCharacters(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  // Convert to sorted array
  const characterList = useMemo(() => {
    return Object.entries(characters)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.message_count - a.message_count);
  }, [characters]);

  return { characters, characterList, loading, error };
};

export const useInteractions = () => {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/data/interactions.json")
      .then((res) => res.json())
      .then((data) => {
        setInteractions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { interactions, loading, error };
};

export const useTimeline = () => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/data/timeline.json")
      .then((res) => res.json())
      .then((data) => {
        setTimeline(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { timeline, loading, error };
};

// Fuse.js search hook
export const useFuseSearch = (scenes) => {
  const fuse = useMemo(() => {
    if (!scenes || scenes.length === 0) return null;
    
    // Flatten messages for search
    const searchableScenes = scenes.map((scene) => ({
      ...scene,
      messagesText: scene.messages.map((m) => `${m.character}: ${m.content}`).join(" "),
      charactersText: scene.characters.join(" "),
    }));

    return new Fuse(searchableScenes, {
      keys: [
        { name: "title", weight: 0.4 },
        { name: "summary", weight: 0.3 },
        { name: "charactersText", weight: 0.2 },
        { name: "messagesText", weight: 0.1 },
      ],
      threshold: 0.4,
      includeScore: true,
      ignoreLocation: true,
    });
  }, [scenes]);

  const search = (query) => {
    if (!fuse || !query.trim()) return [];
    return fuse.search(query).slice(0, 20);
  };

  return { search };
};

// Statistics calculations
export const useStats = (scenes, characters, timeline) => {
  return useMemo(() => {
    if (!scenes.length || !Object.keys(characters).length || !timeline.length) {
      return {
        totalScenes: 0,
        totalMessages: 0,
        totalCharacters: 0,
        activeDays: 0,
        dateRange: { start: "", end: "" },
      };
    }

    const totalScenes = scenes.length;
    const totalMessages = scenes.reduce((acc, scene) => acc + scene.messages.length, 0);
    const totalCharacters = Object.keys(characters).length;
    const activeDays = timeline.length;
    
    const dates = timeline.map((t) => t.date).sort();
    const dateRange = {
      start: dates[0],
      end: dates[dates.length - 1],
    };

    return {
      totalScenes,
      totalMessages,
      totalCharacters,
      activeDays,
      dateRange,
    };
  }, [scenes, characters, timeline]);
};
