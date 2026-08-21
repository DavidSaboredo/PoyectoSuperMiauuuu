// Datos declarativos de mundos y secciones. Cargar antes de game.js.
// ===== Estructura de niveles y progresión =====
// Planos independientes. Las físicas siguen siendo sencillas, pero cada
// nivel posee sus propios vacíos, alturas, refugios y ritmo de recorrido.
const MAP_BLUEPRINTS = {
    1: {
        goalX: 5070,
        ground: [[0, 720], [830, 1500], [1620, 2180], [2290, 3200], [3360, 4050], [4200, 5400]],
        structures: [{x: 400, h: 48}, {x: 650, h: 68}, {x: 1080, h: 54}, {x: 1360, h: 76}, {x: 1810, h: 62}, {x: 2460, h: 78}, {x: 2790, h: 52}, {x: 3520, h: 70}, {x: 3890, h: 84}, {x: 4510, h: 58}, {x: 4870, h: 88}],
        platforms: [
            {x: 210, y: 302, type: 'stair', width: 104, height: 18},
            {x: 330, y: 252, type: 'question'}, {x: 505, y: 286, type: 'brick'},
            {x: 537, y: 286, type: 'brick'}, {x: 752, y: 318, type: 'stair', width: 118, height: 18},
            {x: 910, y: 270, type: 'question'}, {x: 1190, y: 222, type: 'stair', width: 112, height: 20},
            {x: 1462, y: 305, type: 'brick'}, {x: 1535, y: 272, type: 'stair', width: 116, height: 18},
            {x: 1730, y: 244, type: 'question'}, {x: 1990, y: 292, type: 'stair', width: 124, height: 18},
            {x: 2205, y: 315, type: 'stair', width: 120, height: 18}, {x: 2570, y: 248, type: 'question'},
            {x: 2870, y: 292, type: 'stair', width: 124, height: 18},
            {x: 3290, y: 255, type: 'stair', width: 128, height: 18}, {x: 3490, y: 212, type: 'question'},
            {x: 3720, y: 296, type: 'brick', width: 96, height: 20}, {x: 3845, y: 264, type: 'stair', width: 96, height: 18}, {x: 3980, y: 236, type: 'stair', width: 118, height: 18},
            {x: 4270, y: 188, type: 'question'}, {x: 4460, y: 292, type: 'stair', width: 160, height: 18},
            {x: 4720, y: 244, type: 'brick', width: 94, height: 20}
        ],
        collectibles: [[160,330],[260,270],[350,214],[770,280],[940,232],[1215,180],[1480,266],[1570,230],[1760,205],[2020,252],[2240,276],[2520,300],[2600,210],[2900,254],[3320,205],[3510,168],[3760,258],[4010,198],[4290,142],[4520,254],[4780,208],[5010,286]],
        enemies: [
            {x:500,y:356,minX:420,maxX:690,variant:'scout'},
            {x:970,y:356,minX:850,maxX:1450,variant:'charger'},
            {x:1780,y:356,minX:1640,maxX:2100,variant:'brute'},
            {x:2490,y:356,minX:2310,maxX:2750,variant:'scout'},
            {x:3550,y:356,minX:3400,maxX:3920,variant:'charger'},
            {x:4630,y:356,minX:4410,maxX:4970,variant:'brute'}
        ]
    },
    2: {
        goalX: 5090,
        ground: [[0, 540], [670, 1120], [1270, 1780], [1930, 2410], [2560, 3340], [3520, 5400]],
        structures: [{x:300,h:82},{x:760,h:58},{x:1040,h:92},{x:1390,h:66},{x:1670,h:96},{x:2070,h:72},{x:2690,h:88},{x:3180,h:74},{x:3680,h:104},{x:4210,h:82},{x:4800,h:96}],
        platforms: [
            {x:170,y:286,type:'stair',width:130,height:20},{x:420,y:230,type:'question'},
            {x:560,y:310,type:'stair',width:145,height:18},{x:820,y:244,type:'brick'},{x:852,y:244,type:'brick'},
            {x:990,y:184,type:'question'},{x:1130,y:302,type:'stair',width:170,height:18},
            {x:1340,y:246,type:'stair',width:112,height:18},{x:1510,y:190,type:'question'},
            {x:1792,y:310,type:'stair',width:170,height:18},{x:2040,y:248,type:'brick'},
            {x:2180,y:240,type:'question'},{x:2310,y:198,type:'stair',width:110,height:18},
            {x:2430,y:306,type:'stair',width:150,height:18},{x:2800,y:240,type:'question'},
            {x:3190,y:214,type:'stair',width:128,height:18},{x:3440,y:302,type:'brick',width:98,height:20},
            {x:3640,y:186,type:'question'},{x:3920,y:246,type:'stair',width:126,height:18},
            {x:4170,y:302,type:'stair',width:170,height:18},{x:4450,y:214,type:'question'},{x:4760,y:188,type:'brick',width:104,height:20}
        ],
        collectibles: [[120,330],[210,246],[450,190],[590,270],[720,310],[840,205],[1005,145],[1170,262],[1370,208],[1530,152],[1810,270],[2085,210],[2340,158],[2470,266],[2740,202],[2940,320],[3220,174],[3460,266],[3690,144],[3970,204],[4210,268],[4490,176],[4820,142],[5040,300]],
        enemies: [
            {x:350,y:350,minX:100,maxX:510,variant:'drifter'},
            {x:790,y:248,minX:690,maxX:1080,variant:'stalker'},
            {x:1420,y:350,minX:1290,maxX:1740,variant:'blink'},
            {x:2070,y:272,minX:1950,maxX:2380,variant:'drifter'},
            {x:2720,y:350,minX:2580,maxX:3200,variant:'stalker'},
            {x:3820,y:350,minX:3600,maxX:4320,variant:'blink'},
            {x:4870,y:238,minX:4700,maxX:5170,variant:'stalker'}
        ]
    },
    3: {
        goalX: 5100,
        ground: [[0, 430], [560, 1010], [1160, 1620], [1780, 2280], [2440, 3300], [3500, 5400]],
        structures: [{x:250,h:96},{x:690,h:72},{x:930,h:112},{x:1290,h:86},{x:1530,h:120},{x:1960,h:76},{x:2170,h:105},{x:2660,h:92},{x:3160,h:130},{x:3740,h:88},{x:4280,h:110},{x:4850,h:98}],
        platforms: [
            {x:100,y:292,type:'stair',width:120,height:18},{x:350,y:224,type:'question'},
            {x:455,y:310,type:'stair',width:138,height:18},{x:650,y:246,type:'brick'},{x:682,y:246,type:'brick'},
            {x:820,y:180,type:'stair',width:115,height:18},{x:1095,y:226,type:'question'},
            {x:1040,y:320,type:'stair',width:150,height:18},{x:1250,y:248,type:'stair',width:130,height:18},
            {x:1440,y:186,type:'question'},{x:1640,y:310,type:'stair',width:170,height:18},
            {x:1880,y:250,type:'brick'},{x:1912,y:250,type:'brick'},{x:2130,y:188,type:'question'},
            {x:2290,y:312,type:'stair',width:180,height:18},{x:2580,y:246,type:'stair',width:132,height:18},
            {x:2740,y:286,type:'stair',width:154,height:18},{x:2820,y:190,type:'question'},
            {x:2950,y:270,type:'stair',width:134,height:18},{x:3160,y:230,type:'stair',width:136,height:18},{x:3400,y:176,type:'question'},
            {x:3620,y:314,type:'stair',width:180,height:18},{x:3860,y:248,type:'brick',width:100,height:20},
            {x:4110,y:186,type:'stair',width:122,height:18},{x:4410,y:236,type:'question'},
            {x:4680,y:304,type:'stair',width:170,height:18}
        ],
        collectibles: [[120,252],[300,300],[370,185],[480,272],[600,282],[690,208],[850,142],[995,262],[1080,280],[1280,210],[1460,148],[1670,272],[1900,212],[2150,150],[2320,274],[2610,208],[2840,152],[3000,320],[3270,194],[3480,136],[3700,274],[3920,208],[4180,148],[4460,194],[4720,278],[5030,218]],
        enemies: [
            {x:270,y:356,minX:80,maxX:400,variant:'crawler'},
            {x:720,y:356,minX:580,maxX:980,variant:'leaper'},
            {x:1320,y:356,minX:1180,maxX:1580,variant:'shell'},
            {x:1970,y:356,minX:1800,maxX:2240,variant:'crawler'},
            {x:2660,y:356,minX:2480,maxX:2880,variant:'leaper'},
            {x:3840,y:356,minX:3620,maxX:4140,variant:'shell'},
            {x:4760,y:356,minX:4510,maxX:5100,variant:'crawler'}
        ]
    },
    4: {
        goalX: 5100,
        ground: [[0, 190], [5160, 5400]],
        structures: [],
        platforms: [
            {x:235,y:316,type:'stair',width:105,height:20},{x:390,y:266,type:'stair',width:72,height:22},
            {x:520,y:210,type:'stair',width:80,height:20},{x:640,y:270,type:'stair',width:100,height:20},{x:674,y:176,type:'question'},
            {x:790,y:318,type:'stair',width:118,height:20},{x:965,y:240,type:'stair',width:82,height:22},
            {x:1110,y:180,type:'stair',width:80,height:20},{x:1240,y:250,type:'stair',width:110,height:20},{x:1279,y:156,type:'question'},
            {x:1400,y:310,type:'stair',width:100,height:20},{x:1550,y:225,type:'stair',width:92,height:22},
            {x:1710,y:160,type:'stair',width:80,height:20},{x:1850,y:235,type:'stair',width:118,height:20},{x:1893,y:141,type:'question'},
            {x:2020,y:305,type:'stair',width:100,height:20},{x:2180,y:220,type:'stair',width:90,height:22},
            {x:2340,y:155,type:'stair',width:80,height:20},{x:2480,y:235,type:'stair',width:110,height:20},{x:2519,y:141,type:'question'},
            {x:2650,y:305,type:'stair',width:105,height:20},{x:2810,y:250,type:'stair',width:100,height:22},
            {x:3020,y:190,type:'stair',width:88,height:20},{x:3190,y:255,type:'stair',width:118,height:22},{x:3250,y:160,type:'question'},
            {x:3410,y:315,type:'stair',width:132,height:20},{x:3620,y:228,type:'stair',width:96,height:22},{x:3810,y:170,type:'stair',width:86,height:20},
            {x:4020,y:242,type:'stair',width:122,height:20},{x:4070,y:148,type:'question'},
            {x:4250,y:316,type:'stair',width:110,height:20},{x:4440,y:228,type:'stair',width:100,height:22},
            {x:4630,y:170,type:'stair',width:84,height:20},{x:4810,y:244,type:'stair',width:126,height:20}
        ],
        collectibles: [[250,278],[420,226],[530,172],[670,232],[820,280],[990,200],[1120,142],[1270,212],[1430,272],[1580,185],[1720,122],[1880,195],[2050,267],[2210,182],[2350,117],[2510,197],[2680,267],[2840,212],[3040,150],[3230,120],[3450,280],[3650,188],[3840,130],[4050,118],[4280,282],[4470,186],[4680,132],[4920,200]],
        enemies: []
    },
    5: {
        goalX: 5090,
        ground: [[0, 620], [760, 1280], [1420, 2070], [2230, 3200], [3360, 4090], [4260, 5400]],
        structures: [{x:280,h:78},{x:520,h:118},{x:900,h:92},{x:1190,h:130},{x:1530,h:76},{x:1870,h:122},{x:2380,h:96},{x:2760,h:128},{x:3480,h:106},{x:3870,h:138},{x:4510,h:94},{x:4920,h:126}],
        platforms: [
            {x:130,y:260,type:'stair',width:130,height:18},{x:390,y:185,type:'question'},
            {x:640,y:312,type:'stair',width:150,height:18},{x:820,y:235,type:'brick',width:75,height:20},
            {x:1010,y:155,type:'stair',width:120,height:18},{x:1369,y:221,type:'question'},
            {x:1320,y:315,type:'stair',width:130,height:18},{x:1540,y:205,type:'brick',width:82,height:20},
            {x:1780,y:135,type:'question'},{x:1990,y:255,type:'stair',width:150,height:18},
            {x:2100,y:315,type:'stair',width:160,height:18},{x:2290,y:205,type:'question'},
            {x:2580,y:145,type:'stair',width:125,height:18},{x:2820,y:245,type:'brick',width:90,height:20},
            {x:3320,y:268,type:'stair',width:148,height:18},{x:3560,y:188,type:'question'},
            {x:3750,y:308,type:'stair',width:164,height:18},{x:4010,y:222,type:'brick',width:96,height:20},
            {x:4330,y:156,type:'stair',width:126,height:18},{x:4580,y:252,type:'question'},{x:4870,y:198,type:'brick',width:100,height:20}
        ],
        collectibles: [[140,220],[300,170],[400,145],[650,270],[840,195],[1030,115],[1250,210],[1420,275],[1560,165],[1800,95],[2010,215],[2140,275],[2390,165],[2600,105],[2840,205],[3000,150],[3340,238],[3600,142],[3790,274],[4050,176],[4340,118],[4610,204],[4890,156],[5080,224]],
        enemies: [
            {x:330,y:250,minX:120,maxX:580,variant:'drifter'},
            {x:850,y:180,minX:770,maxX:1240,variant:'surger'},
            {x:1500,y:260,minX:1440,maxX:2020,variant:'mine'},
            {x:2350,y:190,minX:2240,maxX:2750,variant:'drifter'},
            {x:2850,y:120,minX:2600,maxX:3180,variant:'surger'},
            {x:3740,y:210,minX:3500,maxX:4040,variant:'mine'},
            {x:4680,y:170,minX:4440,maxX:5050,variant:'surger'}
        ]
    },
    6: {
        bossZone: { triggerX: 3720, minX: 4060, maxX: 4620, bossX: 4380, bossY: 280 },
        rescueX: 4870,
        ground: [[0, 700], [830, 1450], [1560, 2480], [2640, 3480], [3640, 5400]],
        structures: [{x:360,h:90},{x:650,h:62},{x:1040,h:110},{x:1360,h:78},{x:1740,h:120},{x:1970,h:90},{x:2810,h:132},{x:3230,h:98},{x:3820,h:126},{x:4210,h:104}],
        platforms: [
            {x:180,y:285,type:'stair',width:130,height:20},{x:470,y:215,type:'brick',width:90,height:22},
            {x:720,y:315,type:'stair',width:142,height:20},{x:940,y:250,type:'question'},
            {x:1160,y:185,type:'stair',width:125,height:20},{x:1460,y:310,type:'stair',width:130,height:20},
            {x:1640,y:235,type:'brick',width:94,height:22},{x:1870,y:180,type:'question'},
            {x:2580,y:305,type:'stair',width:160,height:20},{x:2860,y:238,type:'brick',width:104,height:22},
            {x:3120,y:176,type:'question'},{x:3380,y:298,type:'stair',width:150,height:20},
            {x:3610,y:216,type:'brick',width:96,height:22},{x:3920,y:164,type:'stair',width:124,height:20},
            {x:4720,y:232,type:'question'}
        ],
        collectibles: [[150,330],[210,247],[500,175],[740,275],[960,210],[1180,145],[1480,270],[1670,195],[1890,130],[2070,310],[2620,272],[2910,198],[3140,134],[3410,264],[3650,184],[3940,124],[4760,188]],
        enemies: []
    },
    7: {
        goalX: 5120,
        timerSeconds: 85,
        ground: [[0, 470], [610, 1080], [1230, 1700], [1850, 2240], [2400, 3320], [3520, 4360], [4520, 5400]],
        structures: [],
        platforms: [
            {x:500,y:310,type:'stair',width:140,height:18},{x:760,y:230,type:'question'},
            {x:1090,y:315,type:'stair',width:175,height:18},{x:1330,y:240,type:'brick',width:96,height:20},
            {x:1530,y:180,type:'question'},{x:1710,y:310,type:'stair',width:170,height:18},
            {x:1970,y:230,type:'stair',width:118,height:18},{x:2250,y:315,type:'stair',width:180,height:18},
            {x:2500,y:235,type:'question'},{x:2740,y:175,type:'brick',width:105,height:20},
            {x:3240,y:305,type:'stair',width:180,height:18},{x:3480,y:212,type:'question'},
            {x:3730,y:162,type:'stair',width:120,height:18},{x:3970,y:248,type:'brick',width:100,height:20},
            {x:4240,y:300,type:'stair',width:172,height:18},{x:4540,y:220,type:'question'},{x:4820,y:164,type:'stair',width:128,height:18}
        ],
        collectibles: [[130,330],[300,300],[520,270],[780,190],[1020,300],[1120,275],[1360,200],[1550,130],[1730,270],[1990,190],[2280,275],[2520,195],[2770,135],[3000,300],[3260,266],[3510,176],[3770,122],[4010,208],[4290,274],[4580,194],[4860,132],[5080,248]],
        enemies: []
    }
};

// La Ciudad Sumergida continúa en 4.2 con un corredor abierto diseñado
// alrededor de corrientes y remolinos. 4.1 conserva el mapa original.
const LEVEL_FOUR_BLUEPRINTS = {
    1: MAP_BLUEPRINTS[5],
    2: {
        goalX: 5100,
        ground: [[0, 5400]],
        structures: [{x:520,h:72},{x:1260,h:110},{x:2080,h:82},{x:2920,h:126},{x:3780,h:92},{x:4620,h:118}],
        platforms: [
            {x:180,y:285,type:'stair',width:150,height:18},{x:470,y:205,type:'question'},
            {x:820,y:300,type:'stair',width:170,height:18},{x:1120,y:165,type:'brick',width:105,height:20},
            {x:1480,y:265,type:'stair',width:145,height:18},{x:1810,y:120,type:'question'},
            {x:2180,y:305,type:'stair',width:180,height:18},{x:2520,y:185,type:'brick',width:120,height:20},
            {x:2860,y:275,type:'stair',width:150,height:18},{x:3230,y:135,type:'question'},
            {x:3560,y:300,type:'stair',width:180,height:18},{x:3920,y:178,type:'brick',width:110,height:20},
            {x:4260,y:270,type:'stair',width:160,height:18},{x:4650,y:145,type:'question'},{x:4900,y:260,type:'stair',width:135,height:18}
        ],
        collectibles: [[160,245],[410,205],[690,300],[930,245],[1160,125],[1450,225],[1760,160],[2070,275],[2380,220],[2620,145],[2920,235],[3200,105],[3510,260],[3820,210],[4050,140],[4350,230],[4660,105],[4930,220]],
        enemies: [
            {x:720,y:180,minX:520,maxX:980,variant:'surger'},
            {x:1660,y:230,minX:1420,maxX:1940,variant:'drifter'},
            {x:2730,y:150,minX:2480,maxX:3100,variant:'mine'},
            {x:3710,y:220,minX:3440,maxX:4070,variant:'surger'},
            {x:4620,y:165,minX:4380,maxX:4960,variant:'drifter'}
        ]
    },
    3: {
        goalX: 5100,
        ground: [[0, 5400]],
        structures: [{x:520,h:80},{x:1280,h:115},{x:2050,h:88},{x:2860,h:125},{x:3600,h:96}],
        platforms: [
            {x:220,y:285,type:'stair',width:150,height:18},{x:620,y:175,type:'question'},
            {x:980,y:300,type:'stair',width:180,height:18},{x:1420,y:150,type:'brick',width:120,height:20},
            {x:1840,y:270,type:'stair',width:165,height:18},{x:2260,y:135,type:'question'},
            {x:2640,y:300,type:'stair',width:180,height:18},{x:3060,y:165,type:'brick',width:125,height:20},
            {x:3460,y:275,type:'stair',width:170,height:18},{x:3820,y:145,type:'question'},
            {x:4100,y:305,type:'stair',width:210,height:18},{x:4620,y:290,type:'stair',width:230,height:18}
        ],
        collectibles: [[180,245],[520,150],[890,260],[1240,205],[1570,115],[1900,230],[2260,100],[2660,260],[3050,130],[3440,235],[3820,105],[4180,260]],
        enemies: []
    }
};

// La cordillera continúa en un segundo cruce sin suelo firme. Las rocas
// marcadas como lava_stone se desprenden poco después de que Miau las pisa.
const LEVEL_FIVE_BLUEPRINTS = {
    1: MAP_BLUEPRINTS[4],
    2: {
        goalX: 5100,
        ground: [[0, 330], [5050, 5400]],
        structures: [],
        platforms: [
            {x:390,y:310,type:'lava_stone',width:125,height:24,plankIndex:0},
            {x:570,y:250,type:'lava_stone',width:105,height:22,plankIndex:1},
            {x:730,y:185,type:'lava_stone',width:115,height:22,plankIndex:2},
            {x:910,y:275,type:'lava_stone',width:130,height:24,plankIndex:3},
            {x:1100,y:215,type:'lava_stone',width:100,height:22,plankIndex:4},
            {x:1260,y:305,type:'lava_stone',width:145,height:24,plankIndex:5},
            {x:1470,y:235,type:'lava_stone',width:110,height:22,plankIndex:6},
            {x:1640,y:165,type:'lava_stone',width:105,height:22,plankIndex:7},
            {x:1810,y:270,type:'lava_stone',width:140,height:24,plankIndex:8},
            {x:2020,y:205,type:'lava_stone',width:115,height:22,plankIndex:9},
            {x:2200,y:305,type:'lava_stone',width:135,height:24,plankIndex:10},
            {x:2400,y:240,type:'lava_stone',width:105,height:22,plankIndex:11},
            {x:2570,y:170,type:'lava_stone',width:115,height:22,plankIndex:12},
            {x:2750,y:280,type:'lava_stone',width:145,height:24,plankIndex:13},
            {x:2970,y:215,type:'lava_stone',width:110,height:22,plankIndex:14},
            {x:3140,y:145,type:'lava_stone',width:100,height:22,plankIndex:15},
            {x:3310,y:265,type:'lava_stone',width:140,height:24,plankIndex:16},
            {x:3520,y:195,type:'lava_stone',width:110,height:22,plankIndex:17},
            {x:3690,y:300,type:'lava_stone',width:145,height:24,plankIndex:18},
            {x:3900,y:230,type:'lava_stone',width:110,height:22,plankIndex:19},
            {x:4070,y:160,type:'lava_stone',width:105,height:22,plankIndex:20},
            {x:4240,y:275,type:'lava_stone',width:140,height:24,plankIndex:21},
            {x:4450,y:210,type:'lava_stone',width:110,height:22,plankIndex:22},
            {x:4620,y:300,type:'lava_stone',width:135,height:24,plankIndex:23},
            {x:4820,y:235,type:'lava_stone',width:145,height:24,plankIndex:24}
        ],
        collectibles: [[420,270],[600,210],[760,145],[950,235],[1130,175],[1300,265],[1500,195],[1670,125],[1850,230],[2050,165],[2240,265],[2430,200],[2600,130],[2790,240],[3000,175],[3170,105],[3350,225],[3550,155],[3730,260],[3930,190],[4100,120],[4280,235],[4480,170],[4650,260],[4860,195]],
        enemies: []
    },
    3: {
        goalX: 2360,
        ground: [[0, 2600]],
        structures: [
            {x:340,h:55},
            {x:805,h:88},
            {x:1280,h:68},
            {x:1640,h:105}
        ],
        platforms: [
            {x:180,y:310,type:'stair',width:105,height:18},
            // Dejar 60 px libres sobre cada apoyo: Miau mide 48 px con
            // Fuerza Felina y debe poder meterse debajo para golpear el bloque.
            {x:230,y:218,type:'question',searchSpot:true},
            {x:455,y:282,type:'stair',width:120,height:18},
            {x:500,y:190,type:'question',searchSpot:true},
            {x:650,y:330,type:'brick',width:92,height:20},
            {x:900,y:300,type:'stair',width:125,height:18},
            {x:950,y:208,type:'question',searchSpot:true},
            {x:1100,y:270,type:'stair',width:118,height:18},
            {x:1150,y:178,type:'question',searchSpot:true},
            {x:1390,y:305,type:'stair',width:125,height:18},
            {x:1440,y:213,type:'question',searchSpot:true},
            {x:1760,y:278,type:'stair',width:125,height:18},
            {x:1810,y:186,type:'question',searchSpot:true}
        ],
        collectibles: [[120,330],[205,280],[365,285],[480,245],[610,300],[760,265],[920,260],[1110,230],[1300,270],[1420,265],[1580,245],[1770,238],[1940,300],[2180,320]],
        enemies: [],
        dragonZone: { x: 2070, y: 177, width: 150, height: 205, minX: 1990, maxX: 2290 }
    }
};

// La fortaleza se divide en un asalto aéreo y la arena final.
// 6.1 conserva el recorrido original, pero Firulais espera en 6.2.
const LEVEL_SIX_BLUEPRINTS = {
    1: {
        goalX: 5070,
        bossZone: null,
        rescueX: 900,
        ground: [],
        structures: [],
        platforms: [],
        collectibles: [[180,220],[430,155],[690,290],[940,115],[1190,245],[1450,175],[1710,315],[1970,125],[2240,250],[2510,185],[2780,305],[3050,135],[3330,235],[3610,170],[3890,300],[4170,115],[4450,245],[4740,165],[5000,275]],
        enemies: [
            {x:560,y:95,minX:420,maxX:850,spriteIndex:1},
            {x:980,y:285,minX:820,maxX:1260,spriteIndex:2},
            {x:1430,y:155,minX:1260,maxX:1730,spriteIndex:3},
            {x:1870,y:270,minX:1700,maxX:2160,spriteIndex:4},
            {x:2310,y:105,minX:2140,maxX:2600,spriteIndex:5},
            {x:2760,y:235,minX:2580,maxX:3050,spriteIndex:1},
            {x:3210,y:125,minX:3040,maxX:3500,spriteIndex:2},
            {x:3650,y:285,minX:3480,maxX:3940,spriteIndex:3},
            {x:4100,y:150,minX:3930,maxX:4400,spriteIndex:4},
            {x:4600,y:245,minX:4410,maxX:4860,spriteIndex:5}
        ]
    },
    2: {
        goalX: 1510,
        bossZone: { triggerX: 300, minX: 500, maxX: 1100, bossX: 850, bossY: 270 },
        rescueX: 1310,
        ground: [[0, 1650]],
        // Arena despejada: ningún bloque tapa a Firulais, sus proyectiles
        // ni la línea de tiro de Super Miau.
        structures: [],
        platforms: [],
        collectibles: [[150,330],[235,330]],
        enemies: []
    }
};

// El primer capítulo ahora se cuenta en tres recorridos consecutivos.
// La sección 1 reutiliza el plano original sin alterar una sola coordenada.
const LEVEL_ONE_BLUEPRINTS = {
    1: MAP_BLUEPRINTS[1],
    2: {
        goalX: 5070,
        ground: [[0, 5400]],
        structures: [],
        platforms: [
            {x:330,y:342,type:'park_bench_obstacle',width:118,height:38},
            {x:690,y:328,type:'play_slide_step',width:54,height:52},
            {x:744,y:286,type:'play_slide_step',width:54,height:94},
            {x:798,y:244,type:'play_slide_step',width:54,height:136},
            {x:852,y:218,type:'play_slide_deck',width:126,height:22},
            {x:978,y:238,type:'play_slide_slope',width:282,height:112},
            {x:1430,y:176,type:'swing_bar',width:228,height:18},
            {x:1480,y:286,type:'swing_seat',width:48,height:14},
            {x:1572,y:286,type:'swing_seat',width:48,height:14},
            {x:1900,y:342,type:'park_bench_obstacle',width:122,height:38},
            {x:2220,y:350,type:'sandbox',width:220,height:30},
            {x:2680,y:306,type:'seesaw',width:192,height:18},
            {x:3060,y:328,type:'monkey_step',width:96,height:18},
            {x:3130,y:136,type:'ring_frame',width:420,height:18},
            {x:3192,y:226,type:'hanging_ring',width:36,height:36,anchorY:154,ringIndex:0},
            {x:3288,y:206,type:'hanging_ring',width:36,height:36,anchorY:154,ringIndex:1},
            {x:3384,y:226,type:'hanging_ring',width:36,height:36,anchorY:154,ringIndex:2},
            {x:3480,y:206,type:'hanging_ring',width:36,height:36,anchorY:154,ringIndex:3},
            {x:3582,y:308,type:'monkey_step',width:96,height:18},
            {x:3650,y:342,type:'park_bench_obstacle',width:126,height:38},
            {x:4050,y:326,type:'play_slide_step',width:54,height:54},
            {x:4104,y:278,type:'play_slide_step',width:54,height:102},
            {x:4158,y:230,type:'play_slide_deck',width:120,height:22},
            {x:4278,y:250,type:'play_slide_slope',width:224,height:92},
            {x:4740,y:286,type:'question'},
            {x:4820,y:342,type:'park_bench_obstacle',width:112,height:38}
        ],
        collectibles: [[170,332],[360,300],[710,286],[770,244],[830,202],[900,178],[1010,214],[1080,240],[1150,268],[1220,296],[1460,136],[1500,246],[1590,246],[1680,310],[1930,300],[2250,310],[2320,292],[2390,310],[2700,266],[2775,242],[2850,266],[3090,288],[3210,184],[3306,164],[3402,184],[3498,164],[3610,270],[3670,300],[4070,284],[4130,236],[4210,188],[4310,224],[4385,252],[4470,286],[4760,246],[5010,314]],
        enemies: [
            {x:520,y:356,minX:460,maxX:650,variant:'scout'},
            {x:1760,y:356,minX:1670,maxX:1870,variant:'charger'},
            {x:2940,y:356,minX:2890,maxX:3130,variant:'scout'},
            {x:4550,y:356,minX:4490,maxX:4720,variant:'charger'}
        ]
    },
    3: {
        goalX: 5070,
        ground: [[0, 5400]],
        structures: [],
        // 1.3 es una avenida continua: no hay islas, bloques ni
        // plataformas que obliguen a saltar. El reto son únicamente
        // los semáforos, el tránsito y la persecución.
        platforms: [],
        collectibles: [[170,326],[320,300],[520,266],[700,230],[900,270],[1120,306],[1200,302],[1360,260],[1550,226],[1760,270],[1980,230],[2190,278],[2450,310],[2560,302],[2740,258],[2960,220],[3180,270],[3410,232],[3650,278],[3860,310],[3960,302],[4180,254],[4400,218],[4630,266],[4750,246],[5010,310]],
        enemies: []
    }
};

// El segundo capítulo también se divide en tres recorridos. 2.1 es el
// Bosque de los Ecos original; 2.2 y 2.3 agregan mecánicas propias sin
// modificar ninguna coordenada del mapa de fantasmas.
const LEVEL_TWO_BLUEPRINTS = {
    1: MAP_BLUEPRINTS[2],
    2: {
        goalX: 5090,
        ground: [[0, 5400]],
        structures: [
            {x:760,h:52},{x:1540,h:70},{x:2380,h:58},{x:3260,h:76},{x:4140,h:62},{x:4740,h:54}
        ],
        platforms: [
            {x:310,y:300,type:'stair',width:132,height:18},{x:560,y:238,type:'question'},
            {x:980,y:284,type:'stair',width:142,height:18},{x:1240,y:220,type:'brick',width:94,height:20},
            {x:1750,y:294,type:'stair',width:150,height:18},{x:2040,y:226,type:'question'},
            {x:2620,y:286,type:'stair',width:146,height:18},{x:2920,y:214,type:'brick',width:96,height:20},
            {x:3490,y:292,type:'stair',width:152,height:18},{x:3790,y:220,type:'question'},
            {x:4380,y:282,type:'stair',width:148,height:18},{x:4680,y:214,type:'question'}
        ],
        collectibles: [[150,330],[330,260],[590,198],[790,290],[1010,244],[1280,180],[1570,280],[1780,254],[2070,186],[2350,310],[2650,246],[2950,174],[3290,276],[3520,252],[3820,180],[4170,294],[4410,242],[4710,174],[5010,304]],
        enemies: [
            {x:520,y:348,minX:410,maxX:700,variant:'shambler'},
            {x:1120,y:348,minX:910,maxX:1420,variant:'lurker'},
            {x:1880,y:344,minX:1690,maxX:2210,variant:'brute'},
            {x:2760,y:348,minX:2520,maxX:3100,variant:'shambler'},
            {x:3600,y:348,minX:3400,maxX:3970,variant:'lurker'},
            {x:4490,y:344,minX:4300,maxX:4860,variant:'brute'}
        ]
    },
    3: {
        goalX: 5090,
        ground: [[0, 5400]],
        structures: [{x:930,h:54},{x:1880,h:66},{x:2870,h:58},{x:3860,h:72},{x:4700,h:56}],
        platforms: [
            {x:280,y:292,type:'stair',width:136,height:18},{x:510,y:230,type:'question'},
            {x:1020,y:282,type:'stair',width:142,height:18},{x:1320,y:216,type:'brick',width:96,height:20},
            {x:2010,y:288,type:'stair',width:146,height:18},{x:2290,y:220,type:'question'},
            {x:3020,y:286,type:'stair',width:150,height:18},{x:3300,y:214,type:'brick',width:96,height:20},
            {x:4010,y:284,type:'stair',width:148,height:18},{x:4310,y:216,type:'question'},
            {x:4780,y:282,type:'stair',width:130,height:18}
        ],
        collectibles: [[150,328],[310,252],[540,190],[760,306],[1050,242],[1350,176],[1610,304],[1920,280],[2040,248],[2320,180],[2580,302],[2910,276],[3050,246],[3330,174],[3600,306],[3900,278],[4040,244],[4340,176],[4630,304],[4820,242],[5030,300]],
        enemies: [],
        chests: [640, 1510, 2480, 3440, 4410]
    }
};

// V23 · El antiguo nivel 3 se convierte en un capítulo de tres actos.
// 3.1 conserva el mapa y los bichos originales; 3.2 y 3.3 cambian la
// geometría para que sigilo, lianas y puentes sean mecánicas reales.
const LEVEL_THREE_BLUEPRINTS = {
    1: MAP_BLUEPRINTS[3],
    2: {
        goalX: 5090,
        ground: [[0, 5400]],
        structures: [{x:760,h:46},{x:1540,h:58},{x:2460,h:50},{x:3370,h:62},{x:4280,h:48}],
        platforms: [
            {x:430,y:292,type:'stair',width:118,height:18},{x:1080,y:254,type:'stair',width:126,height:18},
            {x:1830,y:286,type:'stair',width:120,height:18},{x:2670,y:246,type:'stair',width:132,height:18},
            {x:3520,y:286,type:'stair',width:126,height:18},{x:4440,y:250,type:'stair',width:130,height:18}
        ],
        collectibles: [[180,330],[470,252],[830,330],[1110,214],[1450,326],[1860,246],[2200,326],[2700,206],[3060,326],[3550,246],[3950,326],[4470,210],[4840,326],[5050,298]],
        enemies: []
    },
    3: {
        goalX: 5090,
        ground: [[0,640],[1350,1680],[2240,2740],[3540,3920],[4500,5400]],
        structures: [{x:1480,h:52},{x:2420,h:66},{x:3670,h:58},{x:4740,h:64}],
        platforms: [
            ...Array.from({length: 14}, (_, i) => ({x:640+i*51,y:356,type:'bridge_plank',width:48,height:18,bridgeGroup:0,plankIndex:i})),
            {x:1780,y:218,type:'hanging_vine',width:38,height:38,anchorY:22,ringIndex:10},
            {x:1970,y:204,type:'hanging_vine',width:38,height:38,anchorY:18,ringIndex:11},
            {x:2160,y:222,type:'hanging_vine',width:38,height:38,anchorY:24,ringIndex:12},
            {x:2360,y:278,type:'question'},
            ...Array.from({length: 16}, (_, i) => ({x:2740+i*50,y:356,type:'bridge_plank',width:47,height:18,bridgeGroup:1,plankIndex:i})),
            {x:4010,y:216,type:'hanging_vine',width:38,height:38,anchorY:20,ringIndex:20},
            {x:4200,y:202,type:'hanging_vine',width:38,height:38,anchorY:18,ringIndex:21},
            {x:4390,y:220,type:'hanging_vine',width:38,height:38,anchorY:23,ringIndex:22},
            {x:4720,y:268,type:'question'}
        ],
        collectibles: [[180,330],[520,322],[760,314],[1120,312],[1450,322],[1798,205],[1988,190],[2178,212],[2370,235],[2590,326],[2870,314],[3180,312],[3470,314],[3700,326],[4028,202],[4218,185],[4408,208],[4660,326],[4900,322],[5070,300]],
        enemies: [
            {x:1450,y:356,minX:1370,maxX:1650,variant:'crawler'},
            {x:2380,y:356,minX:2260,maxX:2680,variant:'shell'},
            {x:3650,y:356,minX:3560,maxX:3890,variant:'leaper'},
            {x:4720,y:356,minX:4520,maxX:5050,variant:'shell'}
        ]
    }
};
