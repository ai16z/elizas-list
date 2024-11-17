export interface Project {
  id: string;
  name: string;
  description: string;
  projectUrl: string;
  github: string;
  image: string;
  author: {
    name: string;
    github: string;
    twitter?: string;
  };
  donation: {
    transactionHash: string;
    amount: string;
    date: string;
  };
  tags: string[];
  addedOn: string;
  metrics?: {
    stars: number;
    forks: number;
  };
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  projects: string[]; // Project IDs
  curator: {
    name: string;
    github: string;
  };
  featured: boolean;
} 