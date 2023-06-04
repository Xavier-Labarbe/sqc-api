import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
const axios = require('axios');
const app = express();
const port = 3000;
dotenv.config();

app.get('/getPlayerList', async (request: Request, response: Response) => {
    let players: string[] = process.env.PLAYERS.split(", ");
    let playerList: Array<Player> = [];
    for (const playerName of players) {
        const playerInfo = await axios.get("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+playerName+"?api_key="+process.env.API_KEY);
        const playerRanks: any = await axios.get("https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/"+playerInfo.data.id+"?api_key="+process.env.API_KEY);

        for (const playerRanksKey in playerRanks.data) {
            if (playerRanks.data[playerRanksKey].queueType == "RANKED_SOLO_5x5"){
                let player = new Player(
                    playerInfo.data.id,
                    playerInfo.data.puuid,
                    playerInfo.data.name,
                    playerInfo.data.profileIconId,
                    playerInfo.data.summonerLevel,
                    playerRanks.data[playerRanksKey].tier,
                    playerRanks.data[playerRanksKey].rank,
                    playerRanks.data[playerRanksKey].leaguePoints,
                    playerRanks.data[playerRanksKey].wins,
                    playerRanks.data[playerRanksKey].losses,
                    playerRanks.data[playerRanksKey].hotStreak,
                );
                playerList.push(player);
            }
        }
    }
    response.send(playerList);
})

class Player {
    encryptedId : string;
    puuid : string;
    name: string;
    profileIconId: number;
    summonerLevel: number;
    rankTier: string;
    rank: string;
    leaguePoints: number;
    wins: number;
    losses: number;
    hotStreak: boolean;

    public constructor(encryptedId : string, puuid: string, name: string,  profileIconId: number, summonerLevel: number, rankTier: string,  rank: string, leaguePoints: number, wins: number, losses: number, hotStreak: boolean) {
        this.encryptedId = encryptedId;
        this.puuid = puuid;
        this.name = name;
        this.profileIconId = profileIconId;
        this.summonerLevel = summonerLevel;
        this.rankTier = rankTier;
        this.rank = rank;
        this.leaguePoints = leaguePoints;
        this.wins = wins;
        this.losses = losses;
        this.hotStreak = hotStreak;
    }
}


app.listen(port, () => {
    console.log(`Starting SQC API on port : ${port}`)
})