import { Table } from "@chakra-ui/react";
import type { Player } from "@/types/types";

interface LeaderboardTableProps {
  players: Player[];
}

export default function LeaderboardTable({ players }: LeaderboardTableProps) {
  return (
    <Table.Root>
      <Table.Header>Leaderboard</Table.Header>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Rank</Table.ColumnHeader>
            <Table.ColumnHeader>Player</Table.ColumnHeader>
            <Table.ColumnHeader>Score</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {players.map((p, idx) => (
            <Table.Row key={p.id}>
              <Table.Cell>{idx + 1}</Table.Cell>
              <Table.Cell>{p.name}</Table.Cell>
              <Table.Cell>{p.cumulative_score}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
  );
}
