export interface RankBadge {
  emoji: string;
  color: string;
  text: string;
}

export function getRankBadge(rank: number): RankBadge {
  switch (rank) {
    case 1:
      return { emoji: "🏆", color: "yellow", text: "#1" };
    case 2:
      return { emoji: "🥈", color: "gray", text: "#2" };
    case 3:
      return { emoji: "🥉", color: "orange", text: "#3" };
    default:
      return { emoji: "", color: "blue", text: `#${rank}` };
  }
}

export function getRowBackground(rank: number): string {
  switch (rank) {
    case 1:
      return "yellow.900";
    case 2:
      return "gray.700";
    case 3:
      return "orange.900";
    default:
      return "gray.800";
  }
}
