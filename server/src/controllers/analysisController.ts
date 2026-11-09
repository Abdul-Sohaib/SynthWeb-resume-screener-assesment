import { Request, Response, NextFunction } from 'express';
import { newAnalysisInputSchema, historyQuerySchema } from '../schemas/analysisSchemas';
import { aiService } from '../services/aiService';
import { dbService } from '../services/dbService';

export class AnalysisController {
  async createAnalysis(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Validate input payload
      const validatedInput = newAnalysisInputSchema.parse(req.body);

      // Safe logging: log candidate name length, not full sensitive text
      console.log(`[AnalysisController] Starting evaluation for candidate: "${validatedInput.candidateName}" (JD length: ${validatedInput.jobDescription.length}, Resume length: ${validatedInput.resume.length})`);

      // 2. Perform AI screening & evaluation (with Zod schema validation & retry)
      const evaluation = await aiService.evaluateResume(
        validatedInput.candidateName,
        validatedInput.jobDescription,
        validatedInput.resume
      );

      // 3. Persist to SQLite
      const savedRecord = await dbService.saveAnalysis(
        validatedInput.candidateName,
        validatedInput.jobDescription,
        validatedInput.resume,
        evaluation
      );

      console.log(`[AnalysisController] Analysis completed and persisted with ID: ${savedRecord.id}, Score: ${savedRecord.matchScore}`);

      // 4. Return success response (FR-02 & API Contract)
      res.status(201).json({
        id: savedRecord.id,
        candidateName: savedRecord.candidateName,
        matchScore: savedRecord.matchScore,
        matchingSkills: savedRecord.matchingSkills,
        skillGaps: savedRecord.skillGaps,
        interviewQuestions: savedRecord.interviewQuestions,
        createdAt: savedRecord.createdAt,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAnalyses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedQuery = historyQuerySchema.parse(req.query);
      const records = await dbService.getAnalyses(validatedQuery);
      res.status(200).json(records);
    } catch (err) {
      next(err);
    }
  }

  async getAnalysisById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || id.trim() === '') {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'A valid analysis ID is required.',
          },
        });
        return;
      }

      const record = await dbService.getAnalysisById(id);
      if (!record) {
        res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: `No analysis found with ID '${id}'.`,
          },
        });
        return;
      }

      res.status(200).json(record);
    } catch (err) {
      next(err);
    }
  }
}

export const analysisController = new AnalysisController();

