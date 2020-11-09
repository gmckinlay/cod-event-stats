export interface EventDto {
    name: string;
    date: number;
    teams: TeamDto[];   
    games: {team:TeamDto, match: MatchDto}[][] ;
}

export interface TeamDto {
    name: string;
    players: PlayerDto[];
    matches: MatchDto[];
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

interface MatchDto {
    matchId: string;
    mode: string;
    position: number;
    starTime: number;
    team: string;
    totalDeaths: number;
    totalKills: number;
}

export interface Friends {
    uno: Friend[];
}

interface Friend {
    username: string;
}