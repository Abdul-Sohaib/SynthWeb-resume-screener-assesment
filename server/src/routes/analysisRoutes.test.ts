import request from 'supertest';
import { app } from '../app';

describe('Analysis Routes Integration Tests', () => {
  describe('GET /api/health', () => {
    it('returns status ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('POST /api/analyses input validation', () => {
    it('returns 400 when body is empty', async () => {
      const res = await request(app).post('/api/analyses').send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('returns 400 when candidateName is whitespace only', async () => {
      const res = await request(app).post('/api/analyses').send({
        candidateName: '    ',
        jobDescription: 'Software engineer building web apps with TypeScript.',
        resume: 'Experienced developer with frontend and backend skills.',
      });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('returns 400 when jobDescription is missing', async () => {
      const res = await request(app).post('/api/analyses').send({
        candidateName: 'Jane Doe',
        resume: 'Experienced developer with frontend and backend skills.',
      });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/analyses filter validation', () => {
    it('returns 200 with list on valid query', async () => {
      const res = await request(app).get('/api/analyses');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('returns 400 when minScore > maxScore', async () => {
      const res = await request(app).get('/api/analyses?minScore=95&maxScore=20');
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('returns 400 when score filter is out of bounds', async () => {
      const res = await request(app).get('/api/analyses?minScore=-5');
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/analyses/:id', () => {
    it('returns 404 for non-existent analysis ID', async () => {
      const res = await request(app).get('/api/analyses/non-existent-id-12345');
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });
});

