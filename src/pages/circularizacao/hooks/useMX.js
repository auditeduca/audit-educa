import { useState, useEffect } from "react";
import { apiMX, emailOk } from "../../../libs/utils.js";

const mxCache = {};

export function useMX(email) {
  const [state, setState] = useState(null);

  useEffect(() => {
    if (!emailOk(email)) {
      setState(null);
      return;
    }
    const domain = email.split("@")[1];
    if (mxCache[domain] !== undefined) {
      setState(mxCache[domain]);
      return;
    }
    setState("loading");
    apiMX(email).then((r) => {
      const result = r === null ? "unknown" : r;
      mxCache[domain] = result;
      setState(result);
    });
  }, [email]);

  return state;
}