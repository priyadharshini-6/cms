
/**
 * Mathematical model for calculating readability score
 * Based on multiple readability formulas including Flesch Reading Ease
 * and customized for blog content
 */

interface ReadabilityMetrics {
  sentences: number;
  words: number;
  syllables: number;
  complexWords: number;
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
}

export function calculateReadabilityScore(text: string): number {
  if (!text || text.trim().length === 0) return 0;

  const metrics = analyzeText(text);
  
  // Modified Flesch Reading Ease formula optimized for blog content
  const fleschScore = 206.835 - (1.015 * metrics.avgWordsPerSentence) - (84.6 * metrics.avgSyllablesPerWord);
  
  // Additional factors for blog readability
  const complexWordPenalty = (metrics.complexWords / metrics.words) * 100;
  const sentenceLengthBonus = getSentenceLengthBonus(metrics.avgWordsPerSentence);
  const paragraphStructureBonus = getParagraphStructureBonus(text);
  
  // Combine scores with weights
  let finalScore = (fleschScore * 0.6) + 
                   (sentenceLengthBonus * 0.2) + 
                   (paragraphStructureBonus * 0.1) - 
                   (complexWordPenalty * 0.1);
  
  // Normalize to 0-100 scale
  finalScore = Math.max(0, Math.min(100, finalScore));
  
  return finalScore;
}

function analyzeText(text: string): ReadabilityMetrics {
  // Clean and prepare text
  const cleanText = text.replace(/[^\w\s\.\!\?]/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Count sentences (approximation using common sentence endings)
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;
  
  // Count words
  const words = cleanText.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length || 1;
  
  // Count syllables and complex words
  let totalSyllables = 0;
  let complexWords = 0;
  
  words.forEach(word => {
    const syllableCount = countSyllables(word);
    totalSyllables += syllableCount;
    
    // Complex words: 3+ syllables or 7+ characters
    if (syllableCount >= 3 || word.length >= 7) {
      complexWords++;
    }
  });
  
  return {
    sentences,
    words: wordCount,
    syllables: totalSyllables,
    complexWords,
    avgWordsPerSentence: wordCount / sentences,
    avgSyllablesPerWord: totalSyllables / wordCount
  };
}

function countSyllables(word: string): number {
  if (word.length <= 3) return 1;
  
  const vowelPattern = /[aeiouyAEIOUY]/g;
  const vowelMatches = word.match(vowelPattern) || [];
  let syllables = vowelMatches.length;
  
  // Adjust for common patterns
  if (word.endsWith('e')) syllables--;
  if (word.includes('le') && word.length > 2) syllables++;
  if (syllables === 0) syllables = 1;
  
  return Math.max(1, syllables);
}

function getSentenceLengthBonus(avgWordsPerSentence: number): number {
  // Optimal sentence length for readability is 15-20 words
  const optimal = 17.5;
  const difference = Math.abs(avgWordsPerSentence - optimal);
  
  if (difference <= 2.5) return 100; // Perfect range
  if (difference <= 5) return 80;    // Good range
  if (difference <= 10) return 60;   // Acceptable range
  return 40; // Needs improvement
}

function getParagraphStructureBonus(text: string): number {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  if (paragraphs.length <= 1) return 60; // Single paragraph - moderate score
  
  const avgParagraphLength = text.length / paragraphs.length;
  
  // Optimal paragraph length for web content: 50-150 characters
  if (avgParagraphLength >= 50 && avgParagraphLength <= 150) return 100;
  if (avgParagraphLength >= 30 && avgParagraphLength <= 200) return 80;
  return 60;
}

/**
 * Get readability level description based on score
 */
export function getReadabilityLevel(score: number): string {
  if (score >= 90) return "Very Easy";
  if (score >= 80) return "Easy";
  if (score >= 70) return "Fairly Easy";
  if (score >= 60) return "Standard";
  if (score >= 50) return "Fairly Difficult";
  if (score >= 30) return "Difficult";
  return "Very Difficult";
}

/**
 * Get target audience based on readability score
 */
export function getTargetAudience(score: number): string {
  if (score >= 90) return "5th grade";
  if (score >= 80) return "6th grade";
  if (score >= 70) return "7th grade";
  if (score >= 60) return "8th & 9th grade";
  if (score >= 50) return "10th to 12th grade";
  if (score >= 30) return "College level";
  return "Graduate level";
}
