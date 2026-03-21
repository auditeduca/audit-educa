// src/pages/circularizacao/components/MXBadge.jsx
import { useMX } from "../hooks/useMX";

export default function MXBadge({ email }) {
  const mx = useMX(email);
  if (!email || mx === null) return null;
  if (mx === "loading") return <span className="text-xs text-gray-400">⏳ MX…</span>;
  if (mx === "unknown") return <span className="text-xs text-gray-400">MX desconhecido</span>;
  return (
    <span className={`text-xs font-medium ${mx ? "text-green-600" : "text-amber-600"}`}>
      {mx ? "✓ MX válido" : "⚠ Sem MX"}
    </span>
  );
}