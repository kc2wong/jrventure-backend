import { Request, Response, NextFunction } from 'express';
import Perspective from '@matsukky/perspective-client';
import { Profanity } from '@2toad/profanity';
import * as Diff from 'diff';
import * as OpenCC from 'opencc-js';

import { AchievementApprovalProfanityPostRequestPathDto } from '../../dto-schema';
import { getAchievementApprovalByIdRepo } from '../../../repo/achievement-approval-repo';
import { createAchievementApprovalReviewRepo } from '../../../repo/achievement-approval-review-repo';
import { NotFoundErrorDto } from '../error-validation';
import { replaceParameters } from '../../../util/string-util';
import { dto2Entity as contentTypeDto2Entity } from '../../mapper/achievement-comment-type-mapper';

const perspective = new Perspective({
  apiKey: process.env.PERSPECTIVE_API_KEY!,
});
const perspectiveMessage = 'Profanity analysis score : {1} / 100';

const blockWords = [
  '仆街',
  '扑街',
  '屌',
  '屌你',
  '屌你老母',
  'D你L母',
  '屌你個肺',
  '屌你條街',
  '撚',
  '撚樣',
  'X你老母',
  'C你老母',
  '戇鳩',
  '戇狗',
  '契弟',
  '死仔包',
  '死八婆',
  '死仆街',
  '癲佬',
  '癲婆',
  '黐線',
  '黐筋',
  '黐孖筋',
  '膠',
  '雞',
  '臭雞',
  '賤人',
  '淫賤',
  '淫',
  '冚家剷',
  '狗男女',
  '狗雜',
  '雜種',
  '死廢青',
  '死港豬',
  '廢柴',
  '屎忽',
  '屙尿',
  '屁眼',
  '陰道',
  '陰唇',
  '老母',
  '雞巴',
  '屌七',
  '毒撚',
  '死L',
  '死開',
  '仆你個街',
  '奸你',
  '奸你老母',
  '奸殺',
  '插你',
  '插爆你',
  '干你娘',
  '肏你',
  '肏你媽',
  '舔屎',
  '屎撚',
  '光復香港',
  '香港獨立',
  '港獨',
  '六四',
  '64',
  '民運',
  '打倒共產黨',
  '中共',
  '習近平',
  '共匪',
  '支那',
  '法輪功',
  '民主',
  '真普選',
  '林鄭',
  '黑警',
  '暴政',
  '反送中',
  '港警',
  '殺警',
  '屠殺',
  '暴徒',
  '天安門',
  '8964',
  '警察是狗',
  '港共',
  '中共狗',
  '支共',
  '仆街',
  '扑街',
  '屌你',
  '屌你老母',
  '𨳒你',
  '𨳒你老母',
  '𨳍你',
  '𨳍你老母',
  '𠺘你',
  '𠺘你老母',
  'D你L母',
  'D你老母',
  '撚樣',
  '撚',
  'X你老母',
  'C你老母',
  '戇鳩',
  '戇狗',
  '契弟',
  '死八婆',
  '死7婆',
  '死婆',
  '死仔包',
  '死子包',
  '冚家剷',
  '膠',
  '雞',
  '雞巴',
  '臭雞',
  '賤人',
  '淫賤',
  '淫亂',
  '淫',
  '狗雜',
  '狗種',
  '雜種',
  '死港豬',
  '死廢豬',
  '廢柴',
  '廢物',
  '屎忽',
  '屁眼',
  '屁股',
  '陰道',
  '陰唇',
  '陽道',
  '陽莖',
  '干你娘',
  '肏你',
  '肏你媽',
  '肏你母',
  '舔屎',
  '屎撚',
  '光復香港',
  '香港獨立',
  '港獨',
  '六四',
  '64',
  '8964',
  '民運',
  '打倒共產黨',
  '中共',
  '習近平',
  '共匪',
  '支那',
  '支共',
  '法輪功',
  '民主',
  '真普選',
  '林鄭',
  '黑警',
  '暴政',
  '反送中',
  '殺警',
  '警察是狗',
  '港警',
  '中共狗',
];
const profanity = new Profanity({
  languages: ['zh'],
  wholeWord: false,
  grawlix: '*****',
  grawlixChar: '$',
});
profanity.addWords(blockWords);
const profanityMessage = '\nBlocked words : [{1}]';

const tcConverter = OpenCC.Converter({ from: 'hk', to: 'cn' });
const scConverter = OpenCC.Converter({ from: 'cn', to: 'hk' });

export const checkAchievementApprovalProfanity = async (
  req: Request<AchievementApprovalProfanityPostRequestPathDto, {}, {}>,
  res: Response<any>,
  next: NextFunction
) => {
  const id = req.params.id;
  const now = new Date();

  try {
    const achievementApproval = (await getAchievementApprovalByIdRepo(id))
      ?.achievementApproval;
    if (achievementApproval === undefined) {
      throw new NotFoundErrorDto('Achievement Approval', 'id', id);
    }

    const perspecitveResponse = await perspective.analyze(
      achievementApproval.comment,
      ['TOXICITY']
    );
    const toxicityScore =
      perspecitveResponse.attributeScores.TOXICITY?.summaryScore.value ?? 0;

    const scComment = tcConverter(achievementApproval.comment);
    const censoredComment = profanity.censor(scComment);

    const diff = Diff.diffWords(scComment, censoredComment);
    const blockedWordFound = diff
      .filter((part) => part.removed)
      .map((part) => scConverter(part.value));

    const comment =
      replaceParameters(perspectiveMessage, [
        (100 - toxicityScore * 100).toFixed(2),
      ]) +
      (blockedWordFound.length > 0
        ? replaceParameters(profanityMessage, [blockedWordFound.join(',')])
        : '');

    await createAchievementApprovalReviewRepo({
      comment_type: contentTypeDto2Entity('Conversation'),
      comment,
      created_by_user_oid: 1,
      created_at: now,
      updated_by_user_oid: 1,
      updated_at: now,
      version: 1,
      achievement_approval_oid: achievementApproval.oid,
    });
    res.status(204).end();
  } catch (error) {
    console.error('createAchievement error:', error);
    next(error);
  }
};

const getReplacedWords = (original: string, censored: string): string[] => {
  const originalWords = original.split(/\s+/);
  const censoredWords = censored.split(/\s+/);

  const replaced: string[] = [];

  for (
    let i = 0;
    i < Math.min(originalWords.length, censoredWords.length);
    i++
  ) {
    if (
      originalWords[i] !== censoredWords[i] &&
      censoredWords[i].includes('*')
    ) {
      replaced.push(originalWords[i]);
    }
  }

  return replaced;
};
