import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export function useClientID() {
  const [id, _] = useState(localStorage.getItem("snake-id") || uuidv4());

  useEffect(() => {
    if (localStorage.getItem("snake-id") === null) {
      localStorage.setItem("snake-id", id);
    }
  }, []);

  return id;
}
