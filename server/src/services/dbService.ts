import { PrismaClient } from '@prisma/client';
import { AIEvaluation, HistoryQuery } from '../schemas/analysisSchemas';
import { AnalysisDetail, AnalysisSummary } from '../types';

export class DBService {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  async saveAnalysis(
    candidateName: string,
    jobDescription: string,
    resume: string,
    evaluation: AIEvaluation
  ): Promise<AnalysisDetail> {
    try {
      const record = await this.prisma.analysis.create({
        data: {
          candidateName,
          jobDescription,
          resume,
          matchScore: evaluation.matchScore,
          matchingSkills: JSON.stringify(evaluation.matchingSkills),
          skillGaps: JSON.stringify(evaluation.skillGaps),
          interviewQuestions: JSON.stringify(evaluation.interviewQuestions),
        },
      });

      return {
        id: record.id,
        candidateName: record.candidateName,
        jobDescription: record.jobDescription,
        resume: record.resume,
        matchScore: record.matchScore,
        matchingSkills: JSON.parse(record.matchingSkills) as string[],
        skillGaps: JSON.parse(record.skillGaps) as string[],
        interviewQuestions: JSON.parse(record.interviewQuestions) as string[],
        createdAt: record.createdAt.toISOString(),
      };
    } catch (err: unknown) {
      console.error('[DBService] Failed to save analysis:', err instanceof Error ? err.message : err);
      throw new Error('DATABASE_SAVE_ERROR: Failed to persist analysis to database.');
    }
  }

  async getAnalyses(query: HistoryQuery): Promise<AnalysisSummary[]> {
    try {
      const whereClause: {
        candidateName?: { contains: string };
        matchScore?: { gte?: number; lte?: number };
      } = {};

      if (query.search && query.search.trim().length > 0) {
        whereClause.candidateName = { contains: query.search.trim() };
      }

      if (query.minScore !== undefined || query.maxScore !== undefined) {
        whereClause.matchScore = {};
        if (query.minScore !== undefined) {
          whereClause.matchScore.gte = query.minScore;
        }
        if (query.maxScore !== undefined) {
          whereClause.matchScore.lte = query.maxScore;
        }
      }

      const records = await this.prisma.analysis.findMany({
        where: whereClause,
        select: {
          id: true,
          candidateName: true,
          matchScore: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return records.map((r) => ({
        id: r.id,
        candidateName: r.candidateName,
        matchScore: r.matchScore,
        createdAt: r.createdAt.toISOString(),
      }));
    } catch (err: unknown) {
      console.error('[DBService] Failed to retrieve analyses:', err instanceof Error ? err.message : err);
      throw new Error('DATABASE_QUERY_ERROR: Failed to retrieve analyses from database.');
    }
  }

  async getAnalysisById(id: string): Promise<AnalysisDetail | null> {
    try {
      const record = await this.prisma.analysis.findUnique({
        where: { id },
      });

      if (!record) {
        return null;
      }

      return {
        id: record.id,
        candidateName: record.candidateName,
        jobDescription: record.jobDescription,
        resume: record.resume,
        matchScore: record.matchScore,
        matchingSkills: JSON.parse(record.matchingSkills) as string[],
        skillGaps: JSON.parse(record.skillGaps) as string[],
        interviewQuestions: JSON.parse(record.interviewQuestions) as string[],
        createdAt: record.createdAt.toISOString(),
      };
    } catch (err: unknown) {
      console.error('[DBService] Failed to retrieve analysis by id:', err instanceof Error ? err.message : err);
      throw new Error('DATABASE_QUERY_ERROR: Failed to retrieve analysis details.');
    }
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

export const dbService = new DBService();
