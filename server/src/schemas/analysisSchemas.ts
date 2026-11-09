import { z } from 'zod';

const MAX_FIELD_LENGTH = 50000;

export const newAnalysisInputSchema = z.object({
  candidateName: z
    .string({
      required_error: 'Candidate name is required.',
      invalid_type_error: 'Candidate name must be a string.',
    })
    .trim()
    .min(1, 'Candidate name cannot be empty or whitespace only.')
    .max(200, 'Candidate name cannot exceed 200 characters.'),
  jobDescription: z
    .string({
      required_error: 'Job description is required.',
      invalid_type_error: 'Job description must be a string.',
    })
    .trim()
    .min(10, 'Job description must be at least 10 characters long.')
    .max(MAX_FIELD_LENGTH, `Job description exceeds maximum limit of ${MAX_FIELD_LENGTH} characters.`),
  resume: z
    .string({
      required_error: 'Resume text is required.',
      invalid_type_error: 'Resume text must be a string.',
    })
    .trim()
    .min(10, 'Resume text must be at least 10 characters long.')
    .max(MAX_FIELD_LENGTH, `Resume text exceeds maximum limit of ${MAX_FIELD_LENGTH} characters.`),
});

export const aiEvaluationSchema = z.object({
  matchScore: z
    .number({
      required_error: 'matchScore is required',
      invalid_type_error: 'matchScore must be a number',
    })
    .int('matchScore must be an integer')
    .min(0, 'matchScore cannot be less than 0')
    .max(100, 'matchScore cannot exceed 100'),
  matchingSkills: z
    .array(z.string().trim().min(1, 'Matching skill cannot be empty'), {
      required_error: 'matchingSkills is required',
      invalid_type_error: 'matchingSkills must be an array of strings',
    })
    .length(5, 'matchingSkills must contain exactly 5 items'),
  skillGaps: z
    .array(z.string().trim().min(1, 'Skill gap cannot be empty'), {
      required_error: 'skillGaps is required',
      invalid_type_error: 'skillGaps must be an array of strings',
    })
    .length(3, 'skillGaps must contain exactly 3 items'),
  interviewQuestions: z
    .array(z.string().trim().min(1, 'Interview question cannot be empty'), {
      required_error: 'interviewQuestions is required',
      invalid_type_error: 'interviewQuestions must be an array of strings',
    })
    .length(3, 'interviewQuestions must contain exactly 3 items'),
});

export const historyQuerySchema = z
  .object({
    search: z.string().optional(),
    minScore: z
      .string()
      .optional()
      .transform((val) => (val !== undefined && val !== '' ? Number(val) : undefined))
      .pipe(
        z
          .number({ invalid_type_error: 'minScore must be a valid number' })
          .int('minScore must be an integer')
          .min(0, 'minScore cannot be less than 0')
          .max(100, 'minScore cannot exceed 100')
          .optional()
      ),
    maxScore: z
      .string()
      .optional()
      .transform((val) => (val !== undefined && val !== '' ? Number(val) : undefined))
      .pipe(
        z
          .number({ invalid_type_error: 'maxScore must be a valid number' })
          .int('maxScore must be an integer')
          .min(0, 'maxScore cannot be less than 0')
          .max(100, 'maxScore cannot exceed 100')
          .optional()
      ),
  })
  .refine(
    (data) => {
      if (data.minScore !== undefined && data.maxScore !== undefined) {
        return data.minScore <= data.maxScore;
      }
      return true;
    },
    {
      message: 'minScore cannot be greater than maxScore.',
      path: ['minScore'],
    }
  );

export type NewAnalysisInput = z.infer<typeof newAnalysisInputSchema>;
export type AIEvaluation = z.infer<typeof aiEvaluationSchema>;
export type HistoryQuery = z.infer<typeof historyQuerySchema>;

