export interface User {
    id: string;
    name: string;
    email: string;
  }
  
  export interface Attempt {
    id: string;
    question: string;
    email: string;
    score: number;
  }
  
  export interface LeaderboardEntry {
    email: string;
    name: string;
    attempts: number;
  }
  