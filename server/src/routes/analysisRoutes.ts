import { Router } from 'express';
import { analysisController } from '../controllers/analysisController';

export const analysisRouter = Router();

// POST /api/analyses -> Run analysis and persist
analysisRouter.post('/analyses', (req, res, next) => {
  analysisController.createAnalysis(req, res, next);
});

// GET /api/analyses -> Search & filter history
analysisRouter.get('/analyses', (req, res, next) => {
  analysisController.getAnalyses(req, res, next);
});

// GET /api/analyses/:id -> Retrieve individual saved report
analysisRouter.get('/analyses/:id', (req, res, next) => {
  analysisController.getAnalysisById(req, res, next);
});

