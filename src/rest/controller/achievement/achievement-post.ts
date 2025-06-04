import { Request, Response, NextFunction } from 'express';
import {
  AchievementPost201ResponseDto,
  AchievementPostRequestDto,
} from '../../dto-schema';
import {
  creationDto2Entity,
  entity2Dto,
} from '../../mapper/achievement-mapper';
import {
  creationDto2Entity as creationDto2ApprovalEntity,
  entity2Dto as approvalEntity2Dto,
} from '../../mapper/achievement-approval-mapper';
import { dto2Entity as achievementSubmissionRoleDto2Entity } from '../../mapper/achievement-submission-role-dto-mapper';
import {
  createAchievementRepo,
  findAchievementRepo,
  updateAchievementRepo,
} from '../../../repo/achievement-repo';
import { findByAchievementApprovalOidRepo } from '../../../repo/achievement-approval-attachment-repo';
import { findByAchievementOidRepo } from '../../../repo/achievement-attachment-repo';
import {
  createAchievementApproval as createAchievementApprovalRepo,
  findAchievementApprovalRepo,
  updateAchievementApprovalRepo,
} from '../../../repo/achievement-approval-repo';
import { currentDatetime } from '../../../util/datetime-util';
import {
  validateField,
  validateStudent,
  validateActivity,
} from './achievement-validation';
import {
  approvalBucketName,
  copyObject,
  deleteObject,
  publicBucketName,
} from '../../../util/s3-util';
import {
  Achievement,
  AchievementApprovalStatus,
  AchievementStatus,
} from '@prisma/client';

export const createAchievement = async (
  req: Request<{}, {}, AchievementPostRequestDto>,
  res: Response<AchievementPost201ResponseDto>,
  next: NextFunction
) => {
  try {
    const now = currentDatetime();
    const authenticatedUser = res.locals.authenticatedUser!;
    const withApprovalRight = authenticatedUser.withApprovalRight === true;
    const dto = req.body;

    // Validation
    validateField(dto);
    const student = await validateStudent(dto.studentId, authenticatedUser);
    const { activity, submissionRole } = await validateActivity(
      dto.activityId,
      authenticatedUser
    );

    // Map DTOs to entities
    const achievementEntity = creationDto2Entity(
      dto,
      student,
      activity,
      submissionRole
    );
    const approvalEntity = creationDto2ApprovalEntity(
      dto,
      student,
      activity,
      achievementSubmissionRoleDto2Entity(submissionRole)
    );

    const findQuery = {
      studentId: dto.studentId,
      activityId: dto.activityId,
      role: submissionRole,
      offset: 0,
      limit: 1,
    };

    const prefix = `activity/${dto.activityId}/student/${dto.studentId}`;
    const inObjectKeys = dto.attachment.map((a) => a.objectKey);

    // 🔄 Handle attachment copying
    const newAttachments = await Promise.all(
      dto.attachment
        .filter((a) => a.bucketName)
        .map(async (a) => {
          const fileName = a.objectKey.split('/').pop()!;
          const objectKey = `${prefix}/${fileName}`;
          const fileSize = await copyObject(
            withApprovalRight ? publicBucketName : approvalBucketName,
            `${a.bucketName}/${a.objectKey}`,
            objectKey
          );
          return {
            file_name: a.fileName,
            object_key: objectKey,
            file_size: fileSize,
          };
        })
    );

    // 🧩 Helper to get existing attachments
    const getExistingAttachments = async () => {
      if (withApprovalRight) {
        const existing = (await findAchievementRepo(findQuery)).data[0]
          ?.achievement;
        return existing ? await findByAchievementOidRepo(existing.oid) : [];
      } else {
        const approval = (await findAchievementApprovalRepo(findQuery)).data[0]
          ?.achievementApproval;
        if (approval)
          return await findByAchievementApprovalOidRepo(approval.oid);
        const existing = (await findAchievementRepo(findQuery)).data[0]
          ?.achievement;
        return existing ? await findByAchievementOidRepo(existing.oid) : [];
      }
    };

    // 🧹 Helper to delete unused attachments
    const deleteAttachments = async (
      attachments: { bucket_name: string; object_key: string }[]
    ) =>
      Promise.all(
        attachments.map((a) => deleteObject(a.bucket_name, a.object_key))
      );

    // Process based on approval rights
    const existing = (await findAchievementRepo(findQuery)).data[0]
      ?.achievement;
    const existingApproval = (await findAchievementApprovalRepo(findQuery))
      .data[0]?.achievementApproval;
    const existingAttachments = await getExistingAttachments();

    const retainedAttachments = existingAttachments.filter((a) =>
      inObjectKeys.includes(a.object_key)
    );
    const toDeleteAttachments = existingAttachments.filter(
      (a) => !inObjectKeys.includes(a.object_key)
    );

    if (withApprovalRight) {
      const payload = {
        ...achievementEntity,
        status: 'Approved' as AchievementStatus,
        updated_by_user_oid: authenticatedUser.oid,
        updated_at: now,
      };

      const finalAttachments = [
        ...newAttachments.map((a) => ({ ...a, bucket_name: publicBucketName })),
        ...retainedAttachments,
      ];

      const result = existing
        ? await updateAchievementRepo(
            { ...existing, ...payload },
            finalAttachments
          )
        : await createAchievementRepo(
            {
              ...payload,
              created_by_user_oid: authenticatedUser.oid,
              created_at: now,
              version: 1,
            },
            finalAttachments
          );

      await deleteAttachments(toDeleteAttachments);
      res.status(201).json(entity2Dto(result, student, activity));
    } else {
      const payload = {
        ...approvalEntity,
        status: 'Pending' as AchievementApprovalStatus,
        updated_by_user_oid: authenticatedUser.oid,
        updated_at: now,
      };

      const finalAttachments = [
        ...newAttachments.map((a) => ({
          ...a,
          bucket_name: approvalBucketName,
        })),
        ...retainedAttachments,
      ];

      const result = existingApproval
        ? await updateAchievementApprovalRepo(
            { ...existingApproval, ...payload },
            finalAttachments
          )
        : await createAchievementApprovalRepo(
            {
              ...payload,
              created_by_user_oid: authenticatedUser.oid,
              created_at: now,
              version: 1,
            },
            finalAttachments
          );

      await deleteAttachments(toDeleteAttachments);
      res.status(201).json(approvalEntity2Dto(result, student, activity));
    }
  } catch (error) {
    console.error('createAchievement error:', error);
    next(error);
  }
};
