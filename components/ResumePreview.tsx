import React from 'react';
import { ResumeData } from '../types';
import { MapPin, Mail, Phone, Globe, ExternalLink } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  previewRef: React.RefObject<HTMLDivElement>;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, previewRef }) => {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div className="flex-1 bg-neutral-100/50 p-4 md:p-8 overflow-auto md:h-screen custom-scrollbar">
      <div className="max-w-[210mm] mx-auto shadow-2xl print:shadow-none">
        
        {/* A4 Page Render */}
        <div 
          ref={previewRef}
          className="bg-white w-full min-h-[297mm] p-[15mm] md:p-[20mm] text-neutral-900 print-layout"
        >
          
          {/* Header */}
          <header className="border-b pb-6 mb-6 border-neutral-200">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 uppercase mb-2">{personalInfo.fullName || "Your Name"}</h1>
            <p className="text-xl text-neutral-500 font-medium mb-4">{personalInfo.jobTitle || "Target Job Title"}</p>
            
            <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-neutral-600">
              {personalInfo.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>
                </div>
              )}
            </div>
          </header>

          {/* Summary */}
          {personalInfo.summary && (
            <section className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-3">Profile</h2>
              <p className="text-sm leading-relaxed text-neutral-800 text-justify">
                {personalInfo.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4">Experience</h2>
              <div className="space-y-6">
                {experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-neutral-900">{exp.position}</h3>
                      <span className="text-xs font-medium text-neutral-500 whitespace-nowrap">
                        {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-neutral-600 mb-2">{exp.company}</div>
                    <div className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line pl-1">
                      {exp.description}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4">Education</h2>
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id}>
                     <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-neutral-900">{edu.institution}</h3>
                      <span className="text-xs font-medium text-neutral-500 whitespace-nowrap">{edu.graduationDate}</span>
                    </div>
                    <div className="text-sm text-neutral-700">
                      {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

           {/* Projects */}
           {projects.length > 0 && (
            <section className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4">Projects</h2>
              <div className="space-y-4">
                {projects.map(proj => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                        {proj.name}
                        {proj.link && <ExternalLink className="w-3 h-3 text-neutral-400" />}
                      </h3>
                    </div>
                    <p className="text-sm text-neutral-700 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span key={idx} className="bg-neutral-100 text-neutral-800 text-xs font-medium px-2.5 py-1 rounded-md border border-neutral-200">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
          
        </div>
      </div>
    </div>
  );
};