import { BlessingResult } from '../types';

const localBlessings: BlessingResult[] = [
  {
    title: '马到成功',
    content: '新春已至，愿你在新的一年里步步高升、事事顺意，努力都有回响，前进都有收获，所求皆如愿，所行皆坦途。',
    luckyPrediction: '今年更适合稳扎稳打，学习和工作都有望看到实在进步。',
    visualTheme: 'golden_horse',
  },
  {
    title: '一马当先',
    content: '愿你新岁勇敢开局，关键时刻敢冲敢拼，机会主动靠近你，贵人也愿意拉你一把，整年节奏越走越顺。',
    luckyPrediction: '未来一段时间可能会出现新的尝试机会，值得你主动把握。',
    visualTheme: 'fireworks_grand',
  },
  {
    title: '龙马精神',
    content: '愿你身体康健、精神饱满，家人平安喜乐，日常有小惊喜，日子有烟火气，忙碌之中也能收获踏实与满足。',
    luckyPrediction: '今年整体状态会更稳定，做事节奏也更从容。',
    visualTheme: 'spring_blossom',
  },
  {
    title: '财运亨通',
    content: '愿你福星高照、财气盈门，正财稳步增长，偏财偶有惊喜，花钱有计划，存钱有节奏，钱包和心情一起变鼓。',
    luckyPrediction: '今年在收入管理上更容易看到小幅正向变化。',
    visualTheme: 'wealth_shower',
  },
  {
    title: '阖家安康',
    content: '愿你与家人团圆和睦，灯火可亲，岁岁常欢愉；生活中的小烦恼都被温柔化解，平平安安就是最好的福气。',
    luckyPrediction: '今年家庭关系会更和缓，沟通起来也更顺心。',
    visualTheme: 'lantern_festival',
  },
  {
    title: '万事顺遂',
    content: '愿你新一年少些内耗，多些笃定；每一步都踩在正确方向上，困难有解法，努力有结果，生活越来越亮堂。',
    luckyPrediction: '今年有机会遇到志同道合的人，一起做事会更省力。',
    visualTheme: 'golden_horse',
  },
  {
    title: '前程似锦',
    content: '愿你在新的一年里眼里有光、脚下有路，方向越来越清晰，选择越来越从容，所有认真都会在合适时刻开花结果。',
    luckyPrediction: '下半年更容易收获阶段性成果，关键是保持耐心。',
    visualTheme: 'spring_blossom',
  },
  {
    title: '步步登高',
    content: '愿你新岁气势如虹，工作学习都能稳中有进，关键节点总能抓住机会，贵人相助、同伴给力，越努力越幸运。',
    luckyPrediction: '近期可能会有能力提升或角色升级的机会。',
    visualTheme: 'golden_horse',
  },
  {
    title: '福运连连',
    content: '愿你日子有盼头，生活有甜头，小确幸天天来，烦心事慢慢散，想见的人常相见，想做的事都能按计划推进。',
    luckyPrediction: '近期有望听到一则不错的消息，给你带来好心情。',
    visualTheme: 'lantern_festival',
  },
  {
    title: '鸿运当头',
    content: '愿你新年开门见喜，事业学业一路通达，出门有好风景，回家有暖灯火，忙碌之外也能把生活过得有声有色。',
    luckyPrediction: '今年在人际合作上会更顺畅，沟通成本有望降低。',
    visualTheme: 'fireworks_grand',
  },
  {
    title: '金玉满堂',
    content: '愿你新岁财源广进、收支有序，努力带来回报，计划稳步兑现，理财更有章法，钱包和底气一起涨起来。',
    luckyPrediction: '今年在项目或兼职方面，存在增加收入的可能。',
    visualTheme: 'wealth_shower',
  },
  {
    title: '春和景明',
    content: '愿你在新的一年里心态平和、身体轻盈，生活中的每一天都被温柔照亮，忙时有成就，闲时有自在，幸福感稳稳上升。',
    luckyPrediction: '今年适合培养规律作息和运动习惯，长期回报会更明显。',
    visualTheme: 'spring_blossom',
  },
  {
    title: '心想事成',
    content: '愿你敢想敢做、敢拼敢赢，所有愿望都一步步落地，所有等待都慢慢有回应，所有奔赴都值得，所有热爱都发光。',
    luckyPrediction: '你在意的事情会逐步向好的方向推进，不必太焦虑。',
    visualTheme: 'golden_horse',
  },
  {
    title: '喜气盈门',
    content: '愿你和家人平安喜乐，朋友常伴左右，工作顺顺利利，生活热气腾腾，琐碎日常里也能被好运轻轻眷顾。',
    luckyPrediction: '今年家庭氛围会更温暖，彼此理解也会增加。',
    visualTheme: 'lantern_festival',
  },
  {
    title: '星途灿烂',
    content: '愿你新岁灵感满满、行动果断，想做的项目都能推进，想实现的目标都能拆解落地，一步一脚印走出自己的高光轨迹。',
    luckyPrediction: '今年有机会认识能互相支持的新朋友或合作对象。',
    visualTheme: 'fireworks_grand',
  },
  {
    title: '好运常在',
    content: '愿你每天都被善意包围，被机会看见，被努力成全；该来的惊喜不迟到，该有的收获不缺席，日子越过越有奔头。',
    luckyPrediction: '今年在出行和社交场景里，更容易遇到顺心的人和事。',
    visualTheme: 'wealth_shower',
  },
  {
    title: '鹏程万里',
    content: '愿你在新岁里保持清醒与热爱，目标明确、行动踏实，遇到问题不慌张，遇到机会能抓住，节奏稳稳向前。',
    luckyPrediction: '接下来的一段时间，适合把长期计划拆小并逐步推进。',
    visualTheme: 'golden_horse',
  },
  {
    title: '顺风顺水',
    content: '愿你新一年轻装上阵，烦恼减半、好事加倍，日常工作学习都能有条不紊，生活和心情都更轻松舒展。',
    luckyPrediction: '近期做决定时会更果断，执行效率也会明显提高。',
    visualTheme: 'spring_blossom',
  },
  {
    title: '花开富贵',
    content: '愿你在新春里心有暖阳，家有笑声，身边的人都平安健康；小日子越过越顺，平凡时光也有值得珍惜的亮点。',
    luckyPrediction: '未来几个月更适合经营关系，沟通与协作会更顺。',
    visualTheme: 'lantern_festival',
  },
  {
    title: '扬帆起航',
    content: '愿你带着新的期待出发，把想做的事一点点做成，把想走的路一步步走稳；不急不躁，终会抵达理想的方向。',
    luckyPrediction: '今年适合开始一个新项目，坚持下去会看到清晰反馈。',
    visualTheme: 'fireworks_grand',
  },
  {
    title: '平安喜乐',
    content: '愿你每日三餐有味，四季有人可念，忙时不乱、闲时不空；生活里多一点自在从容，少一点焦虑和内耗。',
    luckyPrediction: '近期的生活节奏会更平衡，休息质量也会慢慢改善。',
    visualTheme: 'lantern_festival',
  },
  {
    title: '锦上添花',
    content: '愿你把已有的优势继续放大，让每一次投入都更有价值；新的机会和旧的积累相互加持，成果自然水到渠成。',
    luckyPrediction: '今年在已有基础上做优化，往往比全面推倒重来更有效。',
    visualTheme: 'golden_horse',
  },
  {
    title: '福满人间',
    content: '愿你在新的一年里被理解、被支持、被温柔对待；也愿你有余力照顾自己，在平淡日常中感受到持续的幸福感。',
    luckyPrediction: '你会更容易遇到愿意倾听、愿意合作的人。',
    visualTheme: 'spring_blossom',
  },
  {
    title: '百事可乐',
    content: '愿你新岁里大事稳住、小事顺心，工作有进展，生活有趣味；每一天都能找到值得开心的小瞬间。',
    luckyPrediction: '短期内会有一两件小确幸，为你带来实实在在的好心情。',
    visualTheme: 'wealth_shower',
  },
];

export const generateRandomBlessing = async (): Promise<BlessingResult> => {
  const randomIndex = Math.floor(Math.random() * localBlessings.length);
  return localBlessings[randomIndex];
};
