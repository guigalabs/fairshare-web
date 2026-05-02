<script lang="ts">
  let {
    percentage,
    size = 32,
    strokeWidth = 4,
    color = "var(--color-accent)",
  }: { percentage: number; size?: number; strokeWidth?: number; color?: string } = $props();

  const radius = $derived((size - strokeWidth) / 2);
  const circumference = $derived(2 * Math.PI * radius);
  const offset = $derived(circumference * (1 - Math.min(Math.max(percentage, 0), 100) / 100));
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 {size} {size}"
  role="img"
  aria-label="{Math.round(percentage)} percent"
>
  <circle
    cx={size / 2}
    cy={size / 2}
    r={radius}
    fill="none"
    stroke="var(--color-border)"
    stroke-width={strokeWidth}
  />
  <circle
    cx={size / 2}
    cy={size / 2}
    r={radius}
    fill="none"
    stroke={color}
    stroke-width={strokeWidth}
    stroke-linecap="round"
    stroke-dasharray={circumference}
    stroke-dashoffset={offset}
    transform="rotate(-90 {size / 2} {size / 2})"
    style="transition: stroke-dashoffset 0.4s ease-out;"
  />
</svg>
