import Mock from 'mockjs'

const Ids = [
  'f6092366bd41f441c030273d8ff65639',
  '56c751b976c401b97766f47816047659',
  '26e537a10999cf9386938e4baf5fa54e',
  'e02da6cf979ad151b0cb0a036a94709c',
  'c7066f06f35b169ed42db306053b7d73',
  'd7666247f4f9b8210f73e94c2ea17617',
]

const Overviews = [
  '据悉演员IU、吕珍九确定接演tvN新剧《月之酒店》，该剧因是韩剧洪氏姐妹的新剧而备受瞩目，讲述精英酒店经理人因一场命中注定的事件而与美如皎月却性格孤僻的老板一同经营月之酒店的故事，IU李知恩将在剧中饰演张满月，因犯下重罪而在漫长岁月里被束缚于月之酒店，在酒店里打发着无聊琐碎的时光，外表高傲美丽，性格却异常孤僻，贪心善变又会耍心机；吕珍九将饰演精英酒店经理人具灿成一角，性格中有着强迫症、洁癖以及偏执的完美主义者，虽然看似理智又冷静，但其实内心也有着脆弱的一面，对自己要求严苛，打造了自己完美的工作履历，坐上了跨国酒店集团最年轻的二掌门的位置，却因意想不到的原因来到了月之酒店，接待鬼客。',
  '虽然张晓娜（张歆艺 饰）脸上的胎记从她一出生起就伴随着她成长，但是她并没有因此而感到自卑，恰恰相反，张晓娜坚信，一个人活得好不好和容貌并没有什么关系，而和他的努力与否息息相关。凭借着自己的刻苦和聪慧，年仅三十岁的她就已经成为了公司里的霸道女总裁，虽然事业上取得了巨大的成功，但张晓娜的感情生活却仍然是一片空白。  　　小维是张晓娜的弟弟，虽然两人相差十岁，但姐弟之间的感情却十分的要好。为了让姐姐能够顺顺利利的嫁出去，小维可谓是操碎了心，甚至为姐姐在婚恋网站上办理了至尊VIP。忽然间，张晓娜的身边出现了常青（郭京飞 饰）和苏一（朱泳腾 饰）两个男人，他们谁才是张晓娜的真命天子呢',
  '庆历年间，北宋貌似繁华安定的景象下暗潮汹涌，周边各个割据政权的细作潜伏于开封城内，窥探大宋军政秘事。北宋为免除战事，维护各民族间的和平与稳定，借秘阁之名，培训少年暗探。经过严密的选拔和审查，诡诈聪慧的元仲辛、美貌机敏的赵简、从不杀生的小景、绝不说谎的王宽、不爱交流的薛映、喜欢美女的韦衙内六位少年，因为种种原因，或情愿或被迫，组成了秘阁第七斋。入学之初，少年们心里都有着自己的小算盘，学习的同时也把学斋闹得鸡飞狗跳，让学官们头疼不已。然而在经历了一次次生死相关的任务后，曾经年轻懵懂的少年们逐渐成长，他们互相团结，用自己的热血和忠诚，为保卫和平献身。在历史的长河中，他们隐姓埋名，成就无人知晓的暗影传奇  。',
  '莎拉在目睹了一个与她长相颇为相似的女人自杀后决定假冒死者身份，而最终却发现了一个惊人的秘密。',
  '天赋异禀的六扇门女捕快袁今夏（谭松韵饰）因为一桩案件和性情狠辣的锦衣卫陆绎（任嘉伦饰）结下梁子，今夏本以为此生与他再无交集，奈何冤家路窄。朝廷十万两修河款不翼而飞，今夏奉命协助陆绎一起下扬州查案，替朝廷找回丢失的官银。本是道不同不相为谋，却因惊天密案联手。两人从势同水火到刮目相看再到情难自已，命运的齿轮从此旋转在一起。然而事与愿违，今夏竟是当年夏言案的遗孤，背负家族血仇的她与陆绎之间横生了无法跨越的鸿沟。最后，两个有情人历经苦难，为救百姓、抗倭寇、锄奸佞，放下家族仇怨，联手对敌，冲破世俗枷锁，勇敢地走到了一起 。',
  '纽约地铁上，几个小混混无端挑衅一个衣着褴褛的流浪汉，却不想被他狠狠收拾了一顿，众人全部被带回警局。警官卡特（塔拉吉·P·汉森 Taraji P. Henson 饰）对这个神秘的流浪汉充满兴趣，正当调查处一丝线索，不想流浪汉竟然被人保释。原来流浪汉是一个曾经接受过中央情报局特殊训练的特工里瑟（詹姆斯·卡维泽 James Caviezel 饰），而保释他的则是拥有无限的财富的富翁芬奇（迈克尔·爱默生 Michael Emerson 饰）。芬奇曾为政府研发了一种可识别罪犯犯罪意识的程序，却被政府认为大材小用而关闭了一部分程序。而现在芬奇希望借助里瑟的能力和这一套程序进行“法外执法”，维持正义、制止犯罪......',
  '韩国财阀继承女因滑翔伞事故被迫在朝鲜着陆，并进入一名军官的生活，这名军官决定帮她躲起来。',
  '忠厚老实的科尔（克里斯·埃文斯 Chris Evans 饰）爱上了神秘莫测的赛迪（安娜·德·阿玛斯 Ana de Armas 饰），却惊诧地发现她是一名秘密特工。在他们决定是否进行第二次约会之前，科尔和赛迪被卷入了一场拯救世界的国际冒险',
  '二战时期西西里岛上宁静的小镇，美艳动人的妇人玛莲娜，撩着波浪长发，穿着时髦的短裙丝袜，踏着诱惑的高跟鞋，烟视媚行，征服了镇上所有男人，也包括年仅13岁的维利图，他悄悄地成为她的小跟班，如影随形地跟踪、窥视她的生活。她摇曳的倩影、她聆听的和音乐、她贴身的衣物…都成为这个被荷尔蒙淹没的少年，最真实、最美好的情欲幻想',
  '奇异博士史蒂芬·斯特兰奇正在参加克里斯汀·帕尔默的婚礼，这时外面的街道上出了乱子，一只巨大的章鱼怪正在跨越维度追逐名叫阿美莉卡·查维兹的女孩。奇异博士和王联手救下女孩，并得知阿美莉卡遭追杀是因其拥有穿越平行宇宙的能力，不过她无法真正控制自己的能力。奇异博士怀疑这其中涉及巫术，遂向旺达求助。不料，正是因失去孩子而悲痛的旺达要不惜一切代价生活在她仍然有孩子的宇宙中，才给奇异博士、王和阿美莉卡带来了一系列的大麻烦',
]

const ImageTags = [
  { Primary: undefined },
  { Primary: undefined },
  { Primary: undefined },
  { Primary: undefined },
  { Primary: undefined },
  { Primary: undefined },
  { Primary: 'ef92331ffab2a5fe363faf29285a103e' },
  { Primary: 'd5a51fef55a965fbae20c7c1dd61fa2e' },
  { Primary: '0842199b64a8ad0b5864f00d042ac19d' },
  { Primary: '12685aea553302db550ec86abc262966' },
  { Primary: '6d097c5cfe9c2f55cc89ce5390e5dc60' },
  { Primary: 'c56674c4c7a449ba96cccb68cb8282a5' },
]

const BackdropImageTags = [
  ['ea706c832ecca0adcdfd5c1f83003a0b'],
  ['85022381abccde30eb2f0c6c18c6ab10'],
  ['fa089c035fb7d0d520fab377c412fbc2'],
  ['03d43aa32828060c3ccd35d3c40e2264'],
  ['a4e4034b80796fab88f8819fc4206557'],
  ['bd132fe4c3fee70acae66817b1986915'],
]

const ImageBLurHashes = [
  { Primary: { ef92331ffab2a5fe363faf29285a103e: 'dPDu;?~BMx9aE3IpE2NG9GNH-:xERkxat7WB-oM|Ioxu' } },
  { Primary: { d5a51fef55a965fbae20c7c1dd61fa2e: 'dcFXbqxaIpRj~CozNHRjWBn*ofR*5QaexaS#EfjZxaS2' } },
  { Primary: { '0842199b64a8ad0b5864f00d042ac19d': 'dYH^Cc}@xZ%1~BtROYn%%LtRtRr?^*tRs.jZpJJUNHR*' } },
  { Primary: { '12685aea553302db550ec86abc262966': 'dSD07TS5M{xa~qNdWBt7?GS4kCxa-pNHbIoe%2R+ofo0' } },
  { Primary: { '6d097c5cfe9c2f55cc89ce5390e5dc60': 'ddH{NI%2~Wxv?w9aWENGIAIAM{WV%MoexukCV[IoRjM{' } },
  { Primary: { c56674c4c7a449ba96cccb68cb8282a5: 'dFA+?J-pELt5=ZRjR+xa9uNbxaRQ5SbvxaMy0LIUogxt' } },
]

const Rating = ['US:TV-14', '15', '18+', 'US:TV-MA']

const Random = Mock.Random

Random.extend({
  Ids: function () {
    return this.pick(Ids)
  },
  Overviews: function () {
    return this.pick(Overviews)
  },
  Rating: function () {
    return this.pick(Rating)
  },
  Years: function () {
    const years = [
      Number(Random.date('yyyy')),
      Number(Random.date('yyyy')),
      Number(Random.date('yyyy')),
      Number(Random.date('yyyy')),
      Number(Random.date('yyyy')),
    ]
    return this.pick(years)
  },
  Titles: function () {
    const titles = [Random.title(), Random.ctitle(), '사랑의 불시착', '호텔 델루나']
    return this.pick(titles)
  },
  ImageTags: function () {
    return this.pick(ImageTags)
  },
  BackdropImageTags: function () {
    return this.pick(BackdropImageTags)
  },
  ImageBlurHashes: function () {
    return this.pick(ImageBLurHashes)
  },
})
Random.Ids()
Random.Overviews()
Random.Rating()
Random.Years()
Random.Titles()
Random.ImageTags()
Random.BackdropImageTags()
Random.ImageBlurHashes()

const MockData = Mock.mock({
  'Items|7000-7200': [
    {
      Name: '@TITLES',
      Id: '@IDS',
      OfficialRating: '@RATING',
      CommunityRating: '@float(0, 10)',
      Type: 'Series',
      MediaType: 'Episode',
      ProductionYear: '@YEARS',
      Overview: '@OVERVIEWS',
      ChildCount: '@integer(1, 15)',
      ImageTags: '@IMAGETAGS',
      BackdropImageTags: '@BACKDROPIMAGETAGS',
      ImageBlurHashes: '@IMAGEBLURHASHES',
      UserData: {
        PlayedPercentage: 0,
        UnplayedItemCount: '@integer(10, 200)',
        PlaybackPositionTicks: 0,
        PlayCount: 0,
        IsFavorite: '@boolean',
        Played: '@boolean',
        Key: '@IDS',
      },
    },
  ],
})

const tempMockData = (mockData = MockData, delay = 100): any => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockData), delay)
  })
}

export default tempMockData
