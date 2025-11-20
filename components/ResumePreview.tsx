
import React from 'react';
import { ResumeData } from '../types';
import { MapPin, Mail, Phone, Globe, ExternalLink } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  previewRef: React.RefObject<HTMLDivElement>;
  isATSMode?: boolean;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, previewRef, isATSMode = false }) => {
  const { personalInfo, experience, education, skills, projects, customSections, themeColor } = data;
  
  // Helper to apply theme color safely
  const themeStyle = { color: isATSMode ? '#000000' : themeColor };
  
  // ATS Mode creates a very simplified, linear layout with standard fonts
  if (isATSMode) {
      return (
        <div className="flex-1 bg-neutral-200/50 p-4 md:p-8 overflow-auto md:h-screen custom-scrollbar">
            <div className="max-w-[210mm] mx-auto shadow-none">
                <div className="bg-white p-4 rounded-t-md border-b border-neutral-200 mb-4 text-sm text-neutral-600 flex items-center justify-between no-print">
                    <span className="font-bold flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        ATS Optimized Mode
                    </span>
                    <span>Standard Layout • No Icons • Linear Parsing</span>
                </div>

                <div 
                  ref={previewRef}
                  className="bg-white w-full min-h-[297mm] p-[20mm] text-black font-serif print-layout"
                  style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif', lineHeight: '1.5' }}
                >
                    {/* Header */}
                    <div className="text-center border-b-2 border-black pb-4 mb-6">
                        <h1 className="text-3xl font-bold uppercase mb-2 tracking-wide">{personalInfo.fullName}</h1>
                        <div className="text-sm mb-2 font-medium">{personalInfo.location}</div>
                        <div className="text-sm flex flex-wrap justify-center gap-4">
                            {personalInfo.email && <span>{personalInfo.email}</span>}
                            {personalInfo.phone && <span>{personalInfo.phone}</span>}
                            {personalInfo.website && <span>{personalInfo.website}</span>}
                        </div>
                    </div>

                    {/* Summary */}
                    {personalInfo.summary && (
                        <div className="mb-6">
                            <h3 className="text-sm font-bold uppercase border-b border-black mb-3">Professional Summary</h3>
                            <p className="text-sm text-justify">{personalInfo.summary}</p>
                        </div>
                    )}

                    {/* Experience */}
                    {experience.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-bold uppercase border-b border-black mb-3">Work Experience</h3>
                            {experience.map(exp => (
                                <div key={exp.id} className="mb-4">
                                    <div className="flex justify-between font-bold text-sm">
                                        <span>{exp.position}</span>
                                        <span>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                                    </div>
                                    <div className="text-sm italic mb-1">{exp.company}</div>
                                    <p className="text-sm whitespace-pre-line">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                     {/* Projects */}
                    {projects.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-bold uppercase border-b border-black mb-3">Projects</h3>
                            {projects.map(proj => (
                                <div key={proj.id} className="mb-3">
                                    <div className="font-bold text-sm mb-1">
                                        {proj.name} {proj.link ? `(${proj.link})` : ''}
                                    </div>
                                    <p className="text-sm">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Education */}
                    {education.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-bold uppercase border-b border-black mb-3">Education</h3>
                            {education.map(edu => (
                                <div key={edu.id} className="mb-2">
                                    <div className="flex justify-between font-bold text-sm">
                                        <span>{edu.institution}</span>
                                        <span>{edu.graduationDate}</span>
                                    </div>
                                    <div className="text-sm">{edu.degree} {edu.field && `- ${edu.field}`}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Skills */}
                    {skills.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-bold uppercase border-b border-black mb-3">Skills</h3>
                            <p className="text-sm">{skills.join(', ')}</p>
                        </div>
                    )}
                    
                    {/* Custom Sections */}
                    {customSections.map(section => (
                        <div key={section.id} className="mb-6">
                            <h3 className="text-sm font-bold uppercase border-b border-black mb-3">{section.title}</h3>
                            {section.items.map(item => (
                                <div key={item.id} className="mb-3">
                                    <div className="flex justify-between font-bold text-sm">
                                        <span>{item.title}</span>
                                        {item.date && <span>{item.date}</span>}
                                    </div>
                                    {item.subtitle && <div className="text-sm italic">{item.subtitle}</div>}
                                    {item.description && <p className="text-sm">{item.description}</p>}
                                </div>
                            ))}
                        </div>
                    ))}

                </div>
            </div>
        </div>
      );
  }

  // STANDARD MODE (Modern Design)
  return (
    <div className="flex-1 bg-neutral-100/50 p-4 md:p-8 overflow-auto md:h-screen custom-scrollbar">
      <div className="max-w-[210mm] mx-auto shadow-2xl print:shadow-none">
        
        {/* A4 Page Render */}
        <div 
          ref={previewRef}
          className="bg-white w-full min-h-[297mm] p-[15mm] md:p-[20mm] text-neutral-900 print-layout"
        >
          
          {/* Header */}
          <header className="border-b pb-6 mb-6" style={{borderColor: themeColor === '#000000' ? '#e5e5e5' : themeColor, borderBottomOpacity: 0.3}}>
            <h1 className="text-4xl font-bold tracking-tight uppercase mb-2" style={themeStyle}>{personalInfo.fullName || "Your Name"}</h1>
            <p className="text-xl text-neutral-500 font-medium mb-4">{personalInfo.jobTitle || "Target Job Title"}</p>
            
            <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-neutral-600">
              {personalInfo.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" style={themeStyle} />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" style={themeStyle} />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" style={themeStyle} />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" style={themeStyle} />
                  <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>
                </div>
              )}
            </div>
          </header>

          {/* Summary */}
          {personalInfo.summary && (
            <section className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={themeStyle}>Profile</h2>
              <p className="text-sm leading-relaxed text-neutral-800 text-justify">
                {personalInfo.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={themeStyle}>Experience</h2>
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
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={themeStyle}>Education</h2>
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
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={themeStyle}>Projects</h2>
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

          {/* Custom Sections */}
          {customSections.map(section => (
            <section key={section.id} className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={themeStyle}>{section.title}</h2>
              <div className="space-y-4">
                {section.items.map(item => (
                  <div key={item.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-neutral-900">{item.title}</h3>
                      {item.date && <span className="text-xs font-medium text-neutral-500 whitespace-nowrap">{item.date}</span>}
                    </div>
                    {item.subtitle && <div className="text-sm font-medium text-neutral-600 mb-1">{item.subtitle}</div>}
                    {item.description && <p className="text-sm text-neutral-700 leading-relaxed">{item.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={themeStyle}>Skills</h2>
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
