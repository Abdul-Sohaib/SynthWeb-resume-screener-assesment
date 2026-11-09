import {
  newAnalysisInputSchema,
  aiEvaluationSchema,
  historyQuerySchema,
} from './analysisSchemas';

describe('analysisSchemas validation', () => {
  describe('newAnalysisInputSchema', () => {
    it('accepts valid input fields', () => {
      const valid = {
        candidateName: 'Jane Doe',
        jobDescription: 'Senior TypeScript Engineer with 5+ years experience building APIs.',
        resume: 'Experienced Full Stack developer with strong TypeScript, React, and Node.js skills.',
      };
      const result = newAnalysisInputSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects empty or whitespace-only candidateName', () => {
      const invalid = {
        candidateName: '   ',
        jobDescription: 'Valid job description with enough characters.',
        resume: 'Valid resume with enough characters to pass length check.',
      };
      const result = newAnalysisInputSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Candidate name cannot be empty');
      }
    });

    it('rejects short jobDescription', () => {
      const invalid = {
        candidateName: 'Jane Doe',
        jobDescription: 'Too short',
        resume: 'Valid resume with enough characters to pass length check.',
      };
      const result = newAnalysisInputSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects short resume', () => {
      const invalid = {
        candidateName: 'Jane Doe',
        jobDescription: 'Valid job description with enough characters.',
        resume: 'Tiny',
      };
      const result = newAnalysisInputSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects oversized inputs (> 50,000 characters)', () => {
      const invalid = {
        candidateName: 'Jane Doe',
        jobDescription: 'a'.repeat(50001),
        resume: 'Valid resume text for testing.',
      };
      const result = newAnalysisInputSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('aiEvaluationSchema', () => {
    const validEvaluation = {
      matchScore: 85,
      matchingSkills: [
        'TypeScript proficiency',
        'Node.js REST API development',
        'React frontend engineering',
        'Prisma SQLite database management',
        'Zod schema validation',
      ],
      skillGaps: [
        'AWS infrastructure knowledge',
        'Kubernetes container orchestration',
        'GraphQL implementation experience',
      ],
      interviewQuestions: [
        'How do you design REST APIs for high reliability?',
        'Can you describe your experience handling state in React?',
        'What strategies do you use for database migrations in Prisma?',
      ],
    };

    it('accepts perfectly structured evaluation', () => {
      const result = aiEvaluationSchema.safeParse(validEvaluation);
      expect(result.success).toBe(true);
    });

    it('rejects matchScore < 0', () => {
      const invalid = { ...validEvaluation, matchScore: -5 };
      const result = aiEvaluationSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects matchScore > 100', () => {
      const invalid = { ...validEvaluation, matchScore: 105 };
      const result = aiEvaluationSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects float matchScore (must be integer)', () => {
      const invalid = { ...validEvaluation, matchScore: 82.5 };
      const result = aiEvaluationSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects matchingSkills with fewer than 5 items', () => {
      const invalid = {
        ...validEvaluation,
        matchingSkills: ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4'],
      };
      const result = aiEvaluationSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects matchingSkills with more than 5 items', () => {
      const invalid = {
        ...validEvaluation,
        matchingSkills: ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4', 'Skill 5', 'Skill 6'],
      };
      const result = aiEvaluationSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects skillGaps with length != 3', () => {
      const invalid = {
        ...validEvaluation,
        skillGaps: ['Gap 1', 'Gap 2'],
      };
      const result = aiEvaluationSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects interviewQuestions with length != 3', () => {
      const invalid = {
        ...validEvaluation,
        interviewQuestions: ['Question 1?'],
      };
      const result = aiEvaluationSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects empty strings in skill arrays', () => {
      const invalid = {
        ...validEvaluation,
        matchingSkills: ['Skill 1', '', 'Skill 3', 'Skill 4', 'Skill 5'],
      };
      const result = aiEvaluationSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('historyQuerySchema', () => {
    it('accepts valid range query', () => {
      const result = historyQuerySchema.safeParse({
        search: 'Jane',
        minScore: '40',
        maxScore: '90',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.minScore).toBe(40);
        expect(result.data.maxScore).toBe(90);
      }
    });

    it('rejects minScore greater than maxScore', () => {
      const result = historyQuerySchema.safeParse({
        minScore: '90',
        maxScore: '50',
      });
      expect(result.success).toBe(false);
    });

    it('rejects minScore < 0 or maxScore > 100', () => {
      const result1 = historyQuerySchema.safeParse({ minScore: '-1' });
      expect(result1.success).toBe(false);

      const result2 = historyQuerySchema.safeParse({ maxScore: '101' });
      expect(result2.success).toBe(false);
    });
  });
});

