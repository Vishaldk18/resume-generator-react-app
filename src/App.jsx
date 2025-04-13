import React, { useState } from 'react';
import axios from 'axios';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import ResumeForm from './components/ResumeForm';

const App = () => {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  const generateText = async (form) => {
    const prompt = `Write a professional ${form.generateFor} for the following:
    Name: ${form.name}
    Job Title: ${form.jobTitle}
    Experience: ${form.experience}
    Skills: ${form.skills}
    `;

    try {
      setLoading(true);
      const res = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'openai/gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setOutput(res.data.choices[0].message.content);
    } catch (err) {
      console.error(err);
      setOutput('Something went wrong...');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    try {
      const doc = new Document({
        sections: [
          {
            children: output
              .split('\n\n') // Split by double line breaks for paragraphs
              .map((para) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: para.trim(),
                      font: 'Calibri',
                      size: 24, // 12pt
                    }),
                  ],
                  spacing: {
                    after: 200,
                  },
                })
              ),
          },
        ],
      });
  
      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, 'generated_resume_cover_letter.docx');
      });
    } catch (error) {
      console.error('Error generating the DOCX file:', error);
      alert('An error occurred while generating the DOCX file.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Resume / Cover Letter Generator
      </h1>

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <ResumeForm onGenerate={generateText} loading={loading}/>
      </div>

      {output && (
        <div className="max-w-3xl mx-auto mt-8">
          <div className="bg-white shadow-md rounded-lg p-6 whitespace-pre-wrap text-gray-800">
            {output}
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
              {loading ? 'Generating...' : 'Download as DOCX'}
            </button>
          </div>
        </div>
      )}

      <footer className="mt-10 text-center text-sm text-gray-600 dark:text-gray-400">
          Made with ❤️ by Vishal Khairnar
      </footer>
    </div>
  );
};

export default App;
