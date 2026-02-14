import { Player, Round } from './types';

export const PLAYERS: Player[] = [
  // Gentlemen
  { id: 'm1', name: 'Mike', nameCn: '泓杰', gender: 'M' },
  { id: 'm2', name: 'Patrick', nameCn: '賢仔', gender: 'M' },
  { id: 'm3', name: 'Tomy', gender: 'M' },
  { id: 'm4', name: 'Simon', nameCn: 'Simon', gender: 'M' },
  // Ladies
  { id: 'f1', name: 'Cui Cui', nameCn: '翠翠', gender: 'F' },
  { id: 'f2', name: 'Gina', nameCn: '蘑菇', gender: 'F' },
  { id: 'f3', name: 'Mya', nameCn: '美伊', gender: 'F' },
  { id: 'f4', name: 'Tracy', gender: 'F' },
];

export const SCHEDULE: Round[] = [
  {
    id: 'r1',
    nameEn: 'Round 1',
    nameCn: '第一轮',
    time: '2:40 PM',
    matches: [
      {
        id: 'r1_m1',
        court: 'A',
        team1: { player1: 'm1', player2: 'f1' }, // Mike/Cui Cui
        team2: { player1: 'm2', player2: 'f2' }, // Patrick/Gina
      },
      {
        id: 'r1_m2',
        court: 'B',
        team1: { player1: 'm3', player2: 'f3' }, // Tomy/Mya
        team2: { player1: 'm4', player2: 'f4' }, // Simon/Tracy
      },
    ],
  },
  {
    id: 'r2',
    nameEn: 'Round 2',
    nameCn: '第二轮',
    time: '3:00 PM',
    matches: [
      {
        id: 'r2_m1',
        court: 'A',
        team1: { player1: 'm1', player2: 'f2' }, // Mike/Gina
        team2: { player1: 'm3', player2: 'f4' }, // Tomy/Tracy
      },
      {
        id: 'r2_m2',
        court: 'B',
        team1: { player1: 'm2', player2: 'f3' }, // Patrick/Mya
        team2: { player1: 'm4', player2: 'f1' }, // Simon/Cui Cui
      },
    ],
  },
  {
    id: 'r3',
    nameEn: 'Round 3',
    nameCn: '第三轮',
    time: '3:20 PM',
    matches: [
      {
        id: 'r3_m1',
        court: 'A',
        team1: { player1: 'm1', player2: 'f3' }, // Mike/Mya
        team2: { player1: 'm4', player2: 'f2' }, // Simon/Gina
      },
      {
        id: 'r3_m2',
        court: 'B',
        team1: { player1: 'm2', player2: 'f4' }, // Patrick/Tracy
        team2: { player1: 'm3', player2: 'f1' }, // Tomy/Cui Cui
      },
    ],
  },
  {
    id: 'r4',
    nameEn: 'Round 4',
    nameCn: '第四轮',
    time: '3:40 PM',
    matches: [
      {
        id: 'r4_m1',
        court: 'A',
        team1: { player1: 'm1', player2: 'f4' }, // Mike/Tracy
        team2: { player1: 'm2', player2: 'f1' }, // Patrick/Cui Cui
      },
      {
        id: 'r4_m2',
        court: 'B',
        team1: { player1: 'm3', player2: 'f2' }, // Tomy/Gina
        team2: { player1: 'm4', player2: 'f3' }, // Simon/Mya
      },
    ],
  },
];

export const TRANSLATIONS = {
  en: {
    title: "Valentine's Mixed Double",
    footer: "App created and designed by Mike",
    tabs: {
      info: 'Info',
      schedule: 'Schedule',
      scores: 'Scores',
      results: 'Leaderboard',
      settings: 'Settings',
    },
    subTabs: {
        rounds: 'Rounds',
        finals: 'Finals',
    },
    info: {
      venue: { label: 'Venue', value: 'Heart Power Tennis Hall (Outdoor Courts A & B)' },
      time: { label: 'Time', value: '2:30 PM – 5:30 PM' },
      logistics: { label: 'Logistics', value: '8 new balls, water provided. Showers available next to courts.' },
      parking: { label: 'Parking', value: 'Free (4hrs) for: Cui Cui, Gina, Mya, Tomy, Tracy.' },
      players: { label: 'Players' },
      ladies: 'Ladies',
      gentlemen: 'Gentlemen',
    },
    schedule: {
      court: 'Court',
      vs: 'vs',
      semis: 'Semi-Finals',
      final: 'Grand Final',
    },
    scores: {
      enterScore: 'Enter Score',
      save: 'Save',
      saved: 'Saved',
      bracketEntry: 'Playoffs Score Entry'
    },
    results: {
      leaderboard: 'Leaderboard',
      games: 'Games Won',
      rank: 'Rank',
      bracket: 'Playoffs Bracket',
      seed: 'Seed',
      semi1: 'Semi-Final 1',
      semi2: 'Semi-Final 2',
      bronze: 'Bronze Match',
      gold: 'Grand Final',
      winner: 'Winner',
    },
    settings: {
        editNames: 'Edit Player Names',
        enName: 'English Name',
        cnName: 'Chinese Name',
        reset: 'Reset Default Names',
    }
  },
  cn: {
    title: "情人节混双网球赛",
    footer: "应用由 Mike 创建和设计",
    tabs: {
      info: '信息',
      schedule: '赛程',
      scores: '比分',
      results: '排行榜',
      settings: '设置',
    },
    subTabs: {
        rounds: '循环赛',
        finals: '决赛',
    },
    info: {
      venue: { label: '地点', value: '心动力网球场馆 (室外 A & B 场)' },
      time: { label: '时间', value: '14:30 – 17:30' },
      logistics: { label: '后勤', value: '提供8个新球和水。球场旁有淋浴。' },
      parking: { label: '停车', value: '翠翠, Gina, Mya, Tomy, Tracy 免费停车4小时。' },
      players: { label: '选手' },
      ladies: '女生',
      gentlemen: '男生',
    },
    schedule: {
      court: '场地',
      vs: '对阵',
      semis: '半决赛',
      final: '决赛',
    },
    scores: {
      enterScore: '录入比分',
      save: '保存',
      saved: '已保存',
      bracketEntry: '淘汰赛比分录入'
    },
    results: {
      leaderboard: '排行榜',
      games: '胜局数',
      rank: '排名',
      bracket: '淘汰赛对阵',
      seed: '种子',
      semi1: '半决赛 1',
      semi2: '半决赛 2',
      bronze: '季军赛',
      gold: '决赛',
      winner: '获胜者',
    },
    settings: {
        editNames: '编辑选手姓名',
        enName: '英文名',
        cnName: '中文名',
        reset: '重置默认姓名',
    }
  },
};