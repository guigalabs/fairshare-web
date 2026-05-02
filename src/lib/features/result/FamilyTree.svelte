<script lang="ts">
  import type { CalculationResult, Gender } from "$engine";
  import { labelFor } from "$lib/features/questionnaire/heirLabels";

  let {
    result,
    subjectGender,
  }: { result: CalculationResult; subjectGender: Gender } = $props();

  // Place each heir on a circle around the deceased. Radius scales with N.
  const layout = $derived.by(() => {
    const shares = result.shares;
    const n = shares.length;
    if (n === 0) return [] as Array<{
      x: number;
      y: number;
      heir: (typeof shares)[number];
    }>;
    const cx = 200;
    const cy = 200;
    const radius = Math.min(140, 70 + n * 8);
    return shares.map((heir, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      return {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        heir,
      };
    });
  });
</script>

<svg
  viewBox="0 0 400 400"
  class="tree"
  role="img"
  aria-label="Family tree showing heirs and their shares"
>
  <!-- Connector lines -->
  {#each layout as p (p.heir.heirType)}
    <line
      x1="200"
      y1="200"
      x2={p.x}
      y2={p.y}
      stroke="var(--color-border)"
      stroke-width="1.5"
      stroke-dasharray="4 4"
    />
  {/each}

  <!-- Center: deceased -->
  <circle cx="200" cy="200" r="30" fill="var(--color-text)" />
  <text
    x="200"
    y="205"
    text-anchor="middle"
    fill="var(--color-bg)"
    font-size="13"
    font-weight="600"
  >
    {subjectGender === "male" ? "M" : "F"}
  </text>

  <!-- Heir nodes -->
  {#each layout as p (p.heir.heirType)}
    <g>
      <circle
        cx={p.x}
        cy={p.y}
        r={Math.max(18, Math.min(34, p.heir.percentage * 0.6 + 16))}
        fill="var(--color-bg-elevated)"
        stroke="var(--color-accent)"
        stroke-width="2"
      />
      <text
        x={p.x}
        y={p.y - 2}
        text-anchor="middle"
        fill="var(--color-text)"
        font-size="11"
        font-weight="600"
      >
        {p.heir.fraction.toString()}
      </text>
      <text
        x={p.x}
        y={p.y + 11}
        text-anchor="middle"
        fill="var(--color-text-muted)"
        font-size="9"
      >
        {p.heir.percentage.toFixed(0)}%
      </text>
    </g>
  {/each}

  <!-- Heir labels under each node -->
  {#each layout as p (p.heir.heirType)}
    <text
      x={p.x}
      y={p.y + 50}
      text-anchor="middle"
      fill="var(--color-text-secondary)"
      font-size="10"
    >
      {labelFor(p.heir.heirType, p.heir.count)}
    </text>
  {/each}
</svg>

<style>
  .tree {
    width: 100%;
    height: auto;
    max-width: 480px;
    display: block;
    margin: 0 auto;
  }
</style>
