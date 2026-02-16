'use client';

import { useState, FormEvent } from 'react';

type Tone = 'professional' | 'casual' | 'academic' | 'creative' | 'conversational';

interface GenerateRequest {
  topic: string;
  keyPoints: string;
  tone: Tone;
}

interface GenerateResponse {
  article: string;
  error?: string;
}

const TONE_OPTIONS: { value: Tone; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'academic', label: 'Academic' },
  { value: 'creative', label: 'Creative' },
  { value: 'conversational', label: 'Conversational' },
];

export default function Home() {
  const [formData, setFormData] = useState<GenerateRequest>({
    topic: '',
    keyPoints: '',
    tone: 'professional',
  });
  const [generatedArticle, setGeneratedArticle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [lastGenerated, setLastGenerated] = useState<number>(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleInputChange = (field: keyof GenerateRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.topic.trim()) {
      setError('Please enter a topic');
      return false;
    }
    if (formData.topic.length > 200) {
      setError('Topic must be 200 characters or less');
      return false;
    }
    if (!formData.keyPoints.trim()) {
      setError('Please enter at least one key point');
      return false;
    }
    if (formData.keyPoints.length > 2000) {
      setError('Key points must be 2000 characters or less');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Simple debouncing (prevent rapid clicks)
    const now = Date.now();
    if (now - lastGenerated < 3000) {
      setError('Please wait a few seconds before generating again');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedArticle('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: GenerateResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate article');
      }

      setGeneratedArticle(data.article);
      setLastGenerated(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedArticle);
      setCopySuccess(true);
      setError('');

      // Clear success message after 2 seconds
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      setError('Failed to copy to clipboard. Please try again or use Ctrl+C/Cmd+C.');
    }
  };

  const downloadMarkdown = () => {
    try {
      const blob = new Blob([generatedArticle], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.topic.slice(0, 50).replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'article'}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 2000);
    } catch (err) {
      setError('Failed to download file. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Authenticity In AI Content Creation
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Transform your rough ideas into polished article drafts with AI
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 mb-8">
          <div className="space-y-6">
            {/* Topic Input */}
            <div>
              <label htmlFor="topic" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Topic <span className="text-red-500">*</span>
              </label>
              <input
                id="topic"
                type="text"
                aria-label="Article topic"
                aria-describedby="topic-char-count"
                value={formData.topic}
                onChange={(e) => handleInputChange('topic', e.target.value)}
                placeholder="e.g., The Future of Remote Work"
                maxLength={200}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all"
                disabled={isLoading}
              />
              <p id="topic-char-count" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {formData.topic.length}/200 characters
              </p>
            </div>

            {/* Key Points Textarea */}
            <div>
              <label htmlFor="keyPoints" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Key Points <span className="text-red-500">*</span>
              </label>
              <textarea
                id="keyPoints"
                aria-label="Key points to cover in the article"
                aria-describedby="keypoints-char-count"
                value={formData.keyPoints}
                onChange={(e) => handleInputChange('keyPoints', e.target.value)}
                placeholder="Enter the main points you want to cover, one per line or separated by commas..."
                maxLength={2000}
                rows={6}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all resize-none"
                disabled={isLoading}
              />
              <p id="keypoints-char-count" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {formData.keyPoints.length}/2000 characters
              </p>
            </div>

            {/* Tone Selector */}
            <div>
              <label htmlFor="tone" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Tone/Style <span className="text-red-500">*</span>
              </label>
              <select
                id="tone"
                aria-label="Select tone or style for the article"
                value={formData.tone}
                onChange={(e) => handleInputChange('tone', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all"
                disabled={isLoading}
              >
                {TONE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              aria-label={isLoading ? 'Generating article, please wait' : 'Generate article'}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Article'
              )}
            </button>
          </div>
        </form>

        {/* Results Section */}
        {generatedArticle && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Generated Article
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={copyToClipboard}
                  aria-label="Copy article to clipboard"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    copySuccess
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {copySuccess ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={downloadMarkdown}
                  aria-label="Download article as markdown file"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    downloadSuccess
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {downloadSuccess ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Downloaded!
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download .md
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Article Preview */}
            <div className="prose dark:prose-invert max-w-none mb-6">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <pre className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200 font-mono">
                  {generatedArticle}
                </pre>
              </div>
            </div>

            {/* Editable Textarea */}
            <div>
              <label htmlFor="editArticle" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Edit Draft
              </label>
              <textarea
                id="editArticle"
                value={generatedArticle}
                onChange={(e) => setGeneratedArticle(e.target.value)}
                rows={20}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white font-mono text-sm transition-all resize-y"
              />
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                You can edit the generated article above. Changes will be reflected in Copy and Download.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
