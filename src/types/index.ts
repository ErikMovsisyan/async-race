export interface Car {
  id: number;
  name: string;
  color: string;
}

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export interface WinnerFull extends Winner {
  car: Car;
}

export interface EngineData {
  velocity: number;
  distance: number;
}

export type SortField = 'wins' | 'time';
export type SortOrder = 'ASC' | 'DESC';
