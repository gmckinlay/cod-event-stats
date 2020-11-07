export interface EventDto {
    name: string;
    date: number;
    teams: TeamDto[];    
}

export interface TeamDto {
    name: string;
    players: PlayerDto[]   
}

interface PlayerDto {
    uno: string;
    totalKills: number;
	totalDeaths: number;
	totalDmg: number;
	totalDmgTkn: number;
    bestPosition: number;
    totalWins: number;
    matches: number;
    kd: number;
    wzMatches: any[];
}

export interface Friends {
    uno: Friend[];
}

interface Friend {
    username: string;
}