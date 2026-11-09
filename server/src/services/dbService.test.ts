import { dbService } from './dbService';
import { AIEvaluation } from '../schemas/analysisSchemas';

describe('DBService Persistence Tests', () => {
  afterAll(async () => {
    await dbService.disconnect();
  });

  const mockEvaluation: AIEvaluation = {
    matchScore: 88,
    matchingSkills: [
      'TypeScript expertise',
      'React frontend architecture',
      'Node.js microservices',
      'Prisma ORM data modeling',
      'REST API design',
    ],
    skillGaps: [
      'AWS CloudFormation',
      'Kubernetes ingress management',
      'GraphQL schema stitching',
    ],
    interviewQuestions: [
      'How do you manage complex asynchronous state in React?',
      'Can you explain how Prisma handles SQLite migrations?',
      'What is your approach to handling API rate limits gracefully?',
    ],
  };

  it('saves an analysis and retrieves it by ID with intact data', async () => {
    const candidateName = 'Test Candidate ' + Date.now();
    const saved = await dbService.saveAnalysis(
      candidateName,
      'Sample Job Description for testing database persistence.',
      'Sample Candidate Resume text for testing database persistence.',
      mockEvaluation
    );

    expect(saved.id).toBeDefined();
    expect(saved.candidateName).toBe(candidateName);
    expect(saved.matchScore).toBe(88);
    expect(saved.matchingSkills).toHaveLength(5);
    expect(saved.skillGaps).toHaveLength(3);
    expect(saved.interviewQuestions).toHaveLength(3);

    // Retrieve by ID
    const retrieved = await dbService.getAnalysisById(saved.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(saved.id);
    expect(retrieved?.candidateName).toBe(candidateName);
    expect(retrieved?.matchingSkills).toEqual(mockEvaluation.matchingSkills);
    expect(retrieved?.skillGaps).toEqual(mockEvaluation.skillGaps);
    expect(retrieved?.interviewQuestions).toEqual(mockEvaluation.interviewQuestions);
  });

  it('filters analyses by candidate name and score range', async () => {
    const candidateA = 'Alice SearchTest ' + Date.now();
    const candidateB = 'Bob SearchTest ' + Date.now();

    await dbService.saveAnalysis(
      candidateA,
      'Job description for Alice',
      'Resume for Alice',
      { ...mockEvaluation, matchScore: 92 }
    );

    await dbService.saveAnalysis(
      candidateB,
      'Job description for Bob',
      'Resume for Bob',
      { ...mockEvaluation, matchScore: 45 }
    );

    // Search by candidate name
    const searchAlice = await dbService.getAnalyses({ search: 'Alice SearchTest' });
    expect(searchAlice.length).toBeGreaterThanOrEqual(1);
    expect(searchAlice[0].candidateName).toContain('Alice SearchTest');

    // Filter by score range [80, 100]
    const highScores = await dbService.getAnalyses({
      search: 'SearchTest',
      minScore: 80,
      maxScore: 100,
    });
    expect(highScores.some((item) => item.candidateName === candidateA)).toBe(true);
    expect(highScores.some((item) => item.candidateName === candidateB)).toBe(false);

    // Filter by score range [40, 50]
    const lowScores = await dbService.getAnalyses({
      search: 'SearchTest',
      minScore: 40,
      maxScore: 50,
    });
    expect(lowScores.some((item) => item.candidateName === candidateB)).toBe(true);
    expect(lowScores.some((item) => item.candidateName === candidateA)).toBe(false);
  });

  it('returns null when querying a non-existent analysis ID', async () => {
    const notFound = await dbService.getAnalysisById('non-existent-cuid-99999');
    expect(notFound).toBeNull();
  });
});

