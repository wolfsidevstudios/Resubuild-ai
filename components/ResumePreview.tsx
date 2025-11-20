
import React from 'react';
import { ResumeData } from '../types';
import { MapPin, Mail, Phone, Globe, ExternalLink } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  previewRef: React.RefObject<HTMLDivElement>;
  isATSMode?: boolean;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, previewRef, isATSMode = false }) => {
  const { personalInfo, experience, education, skills, projects, customSections, themeColor, templateId = 'modern' } = data;
  
  const themeStyle = { color: isATSMode ? '#000000' : themeColor };
  const bgThemeStyle = { backgroundColor: isATSMode ? '#000000' : themeColor };
  const borderThemeStyle = { borderColor: isATSMode ? '#000000' : themeColor };

  // --- COMMON CONTENT RENDERERS ---
  
  const ContactInfo = ({ className = "", iconStyle = {} }) => (
    <div className={`flex flex-wrap gap-y-2 gap-x-4 text-sm ${className}`}>
        {personalInfo.email && (
        <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" style={iconStyle} />
            <span>{personalInfo.email}</span>
        </div>
        )}
        {personalInfo.phone && (
        <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" style={iconStyle} />
            <span>{personalInfo.phone}</span>
        </div>
        )}
        {personalInfo.location && (
        <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" style={iconStyle} />
            <span>{personalInfo.location}</span>
        </div>
        )}
        {personalInfo.website && (
        <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" style={iconStyle} />
            <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>
        </div>
        )}
    </div>
  );

  const ExperienceSection = ({ titleClass = "font-bold uppercase mb-4", itemClass = "mb-6" }) => (
    experience.length > 0 && (
        <section className="mb-8">
            <h2 className={`text-sm tracking-widest ${titleClass}`} style={!isATSMode ? themeStyle : {}}>Experience</h2>
            <div className="space-y-4">
            {experience.map(exp => (
                <div key={exp.id} className={itemClass}>
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
    )
  );

  const EducationSection = ({ titleClass = "font-bold uppercase mb-4" }) => (
      education.length > 0 && (
        <section className="mb-8">
            <h2 className={`text-sm tracking-widest ${titleClass}`} style={!isATSMode ? themeStyle : {}}>Education</h2>
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
      )
  );
  
  const ProjectsSection = ({ titleClass = "font-bold uppercase mb-4" }) => (
      projects.length > 0 && (
        <section className="mb-8">
            <h2 className={`text-sm tracking-widest ${titleClass}`} style={!isATSMode ? themeStyle : {}}>Projects</h2>
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
      )
  );

  const SkillsSection = ({ titleClass = "font-bold uppercase mb-3", chipClass = "bg-neutral-100 text-neutral-800 border-neutral-200" }) => (
      skills.length > 0 && (
        <section className="mb-8">
            <h2 className={`text-sm tracking-widest ${titleClass}`} style={!isATSMode ? themeStyle : {}}>Skills</h2>
            <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
                <span key={idx} className={`text-xs font-medium px-2.5 py-1 rounded-md border ${chipClass}`}>
                {skill}
                </span>
            ))}
            </div>
        </section>
      )
  );
  
  const CustomSectionsRender = ({ titleClass = "font-bold uppercase mb-4" }) => (
      <>
        {customSections.map(section => (
            <section key={section.id} className="mb-8">
            <h2 className={`text-sm tracking-widest ${titleClass}`} style={!isATSMode ? themeStyle : {}}>{section.title}</h2>
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
      </>
  );

  // --- LAYOUT WRAPPER ---
  const LayoutWrapper = ({ children, className = "bg-white" }: any) => (
    <div className="flex-1 bg-neutral-100/50 p-4 md:p-8 overflow-auto md:h-screen custom-scrollbar">
        <div className="max-w-[210mm] mx-auto shadow-2xl print:shadow-none">
             {/* Header Bar for ATS Mode */}
             {isATSMode && (
                <div className="bg-white p-4 rounded-t-md border-b border-neutral-200 mb-4 text-sm text-neutral-600 flex items-center justify-between no-print">
                    <span className="font-bold flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        ATS Optimized Mode
                    </span>
                    <span>Standard Layout • No Icons • Linear Parsing</span>
                </div>
             )}
             
            <div 
                ref={previewRef}
                className={`${className} w-full min-h-[297mm] print-layout text-neutral-900`}
            >
                {children}
            </div>
        </div>
    </div>
  );


  // --- RENDER LOGIC ---

  // 1. ATS MODE (Override everything)
  if (isATSMode) {
      return (
        <LayoutWrapper className="bg-white p-[20mm] font-serif">
            <div style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif', lineHeight: '1.5' }}>
                 <div className="text-center border-b-2 border-black pb-4 mb-6">
                    <h1 className="text-3xl font-bold uppercase mb-2 tracking-wide">{personalInfo.fullName}</h1>
                    <div className="text-sm mb-2 font-medium">{personalInfo.location}</div>
                    <div className="text-sm flex flex-wrap justify-center gap-4">
                        {personalInfo.email && <span>{personalInfo.email}</span>}
                        {personalInfo.phone && <span>{personalInfo.phone}</span>}
                        {personalInfo.website && <span>{personalInfo.website}</span>}
                    </div>
                </div>
                {personalInfo.summary && (
                    <div className="mb-6">
                        <h3 className="text-sm font-bold uppercase border-b border-black mb-3">Professional Summary</h3>
                        <p className="text-sm text-justify">{personalInfo.summary}</p>
                    </div>
                )}
                <ExperienceSection titleClass="font-bold uppercase border-b border-black mb-3" />
                <ProjectsSection titleClass="font-bold uppercase border-b border-black mb-3" />
                <EducationSection titleClass="font-bold uppercase border-b border-black mb-3" />
                <SkillsSection titleClass="font-bold uppercase border-b border-black mb-3" chipClass="bg-transparent border-none p-0" />
                <CustomSectionsRender titleClass="font-bold uppercase border-b border-black mb-3" />
            </div>
        </LayoutWrapper>
      );
  }

  // 2. CREATIVE TEMPLATE (Sidebar Left, Bold Header)
  if (templateId === 'creative') {
      return (
        <LayoutWrapper className="bg-white flex flex-row">
            {/* Sidebar */}
            <div className="w-[70mm] p-8 text-white min-h-[297mm]" style={bgThemeStyle}>
                 <div className="mb-8">
                     <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold mb-6 text-white mx-auto border-2 border-white/30">
                         {personalInfo.fullName.charAt(0)}
                     </div>
                     <h1 className="text-2xl font-bold leading-tight text-center mb-2">{personalInfo.fullName}</h1>
                     <p className="text-white/80 text-center text-sm">{personalInfo.jobTitle}</p>
                 </div>
                 
                 <div className="space-y-6 text-sm text-white/90">
                    <div className="space-y-2">
                        {personalInfo.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 flex-shrink-0" /> <span className="break-all">{personalInfo.email}</span></div>}
                        {personalInfo.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 flex-shrink-0" /> <span>{personalInfo.phone}</span></div>}
                        {personalInfo.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 flex-shrink-0" /> <span>{personalInfo.location}</span></div>}
                        {personalInfo.website && <div className="flex items-center gap-2"><Globe className="w-4 h-4 flex-shrink-0" /> <span className="break-all">{personalInfo.website.replace(/^https?:\/\//, '')}</span></div>}
                    </div>

                    {skills.length > 0 && (
                        <div>
                            <h3 className="font-bold uppercase tracking-widest border-b border-white/30 pb-2 mb-3 text-white">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <span key={i} className="bg-white/20 px-2 py-1 rounded text-xs">{skill}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                     {education.length > 0 && (
                        <div>
                            <h3 className="font-bold uppercase tracking-widest border-b border-white/30 pb-2 mb-3 text-white">Education</h3>
                            <div className="space-y-4">
                                {education.map(edu => (
                                    <div key={edu.id}>
                                        <div className="font-bold">{edu.institution}</div>
                                        <div className="text-xs opacity-80">{edu.degree}</div>
                                        <div className="text-xs opacity-60">{edu.graduationDate}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                 </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 bg-white">
                {personalInfo.summary && (
                    <section className="mb-8">
                        <h2 className="text-lg font-bold uppercase tracking-widest mb-3 text-neutral-800" style={{color: themeColor}}>Profile</h2>
                        <p className="text-sm leading-relaxed text-neutral-600 text-justify">{personalInfo.summary}</p>
                    </section>
                )}
                <ExperienceSection titleClass="text-lg font-bold uppercase tracking-widest mb-4 text-neutral-800" />
                <ProjectsSection titleClass="text-lg font-bold uppercase tracking-widest mb-4 text-neutral-800" />
                <CustomSectionsRender titleClass="text-lg font-bold uppercase tracking-widest mb-4 text-neutral-800" />
            </div>
        </LayoutWrapper>
      );
  }

  // 3. MINIMAL TEMPLATE (Centered, Clean, No heavy borders)
  if (templateId === 'minimal') {
    return (
        <LayoutWrapper className="bg-white p-[20mm]">
             <header className="text-center mb-12">
                <h1 className="text-4xl font-light tracking-tight mb-2" style={{color: themeColor}}>{personalInfo.fullName}</h1>
                <p className="text-sm text-neutral-400 uppercase tracking-widest font-medium mb-4">{personalInfo.jobTitle}</p>
                <div className="flex justify-center gap-4 text-xs text-neutral-500">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>• {personalInfo.phone}</span>}
                    {personalInfo.location && <span>• {personalInfo.location}</span>}
                </div>
             </header>

             <div className="max-w-3xl mx-auto">
                {personalInfo.summary && (
                    <div className="mb-10 text-center">
                         <p className="text-sm leading-7 text-neutral-600 italic">"{personalInfo.summary}"</p>
                    </div>
                )}

                <ExperienceSection titleClass="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6 text-center" />
                <div className="grid grid-cols-1 gap-8">
                     <EducationSection titleClass="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6 text-center" />
                     <ProjectsSection titleClass="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6 text-center" />
                </div>
                <div className="mt-8 text-center">
                     <SkillsSection titleClass="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6 text-center" chipClass="bg-white border border-neutral-200 text-neutral-600" />
                </div>
                <CustomSectionsRender titleClass="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6 text-center" />
             </div>
        </LayoutWrapper>
    );
  }

  // 4. PROFESSIONAL TEMPLATE (Classic Serif Headlines, Horizontal Lines)
  if (templateId === 'professional') {
      return (
        <LayoutWrapper className="bg-white p-[20mm]">
            <header className="border-b-2 border-neutral-800 pb-6 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-neutral-900 mb-2">{personalInfo.fullName}</h1>
                    <p className="text-lg text-neutral-600 font-serif italic">{personalInfo.jobTitle}</p>
                </div>
                <div className="text-right text-sm space-y-1">
                    {personalInfo.email && <div className="font-medium">{personalInfo.email}</div>}
                    {personalInfo.phone && <div>{personalInfo.phone}</div>}
                    {personalInfo.location && <div>{personalInfo.location}</div>}
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8">
                     {personalInfo.summary && (
                        <section className="mb-8">
                             <h2 className="font-serif font-bold text-xl mb-3 border-b border-neutral-200 pb-1" style={{color: themeColor}}>Profile</h2>
                             <p className="text-sm leading-relaxed text-neutral-700">{personalInfo.summary}</p>
                        </section>
                     )}
                     
                     {experience.length > 0 && (
                        <section className="mb-8">
                            <h2 className="font-serif font-bold text-xl mb-4 border-b border-neutral-200 pb-1" style={{color: themeColor}}>Experience</h2>
                            <div className="space-y-6">
                                {experience.map(exp => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between font-bold text-neutral-900 mb-1">
                                            <h3>{exp.position}</h3>
                                            <span className="text-sm text-neutral-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                                        </div>
                                        <div className="text-sm font-medium text-neutral-600 mb-2 italic">{exp.company}</div>
                                        <p className="text-sm text-neutral-700 leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                     )}
                     
                     {projects.length > 0 && (
                        <section className="mb-8">
                             <h2 className="font-serif font-bold text-xl mb-4 border-b border-neutral-200 pb-1" style={{color: themeColor}}>Projects</h2>
                             {projects.map(proj => (
                                <div key={proj.id} className="mb-4">
                                    <h3 className="font-bold text-neutral-900">{proj.name}</h3>
                                    <p className="text-sm text-neutral-700">{proj.description}</p>
                                </div>
                             ))}
                        </section>
                     )}
                     
                     <CustomSectionsRender titleClass="font-serif font-bold text-xl mb-4 border-b border-neutral-200 pb-1" />
                </div>

                <div className="col-span-4 space-y-8">
                    {education.length > 0 && (
                        <section>
                            <h2 className="font-serif font-bold text-lg mb-3 border-b border-neutral-200 pb-1" style={{color: themeColor}}>Education</h2>
                             {education.map(edu => (
                                <div key={edu.id} className="mb-4">
                                    <div className="font-bold text-sm">{edu.institution}</div>
                                    <div className="text-sm italic">{edu.degree}</div>
                                    <div className="text-xs text-neutral-500 mt-1">{edu.graduationDate}</div>
                                </div>
                            ))}
                        </section>
                    )}
                    
                    {skills.length > 0 && (
                         <section>
                            <h2 className="font-serif font-bold text-lg mb-3 border-b border-neutral-200 pb-1" style={{color: themeColor}}>Skills</h2>
                            <div className="flex flex-col gap-2">
                                {skills.map((skill, i) => (
                                    <span key={i} className="text-sm border-b border-dotted border-neutral-200 pb-1">{skill}</span>
                                ))}
                            </div>
                        </section>
                    )}
                    
                    {personalInfo.website && (
                        <section>
                             <h2 className="font-serif font-bold text-lg mb-3 border-b border-neutral-200 pb-1" style={{color: themeColor}}>Links</h2>
                             <a href={personalInfo.website} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline break-words">
                                 {personalInfo.website.replace(/^https?:\/\//, '')}
                             </a>
                        </section>
                    )}
                </div>
            </div>
        </LayoutWrapper>
      );
  }

  // 5. DEFAULT: MODERN TEMPLATE
  return (
    <LayoutWrapper className="bg-white p-[15mm] md:p-[20mm]">
      <header className="border-b pb-6 mb-6" style={{borderColor: themeColor === '#000000' ? '#e5e5e5' : themeColor, borderBottomOpacity: 0.3}}>
        <h1 className="text-4xl font-bold tracking-tight uppercase mb-2" style={themeStyle}>{personalInfo.fullName || "Your Name"}</h1>
        <p className="text-xl text-neutral-500 font-medium mb-4">{personalInfo.jobTitle || "Target Job Title"}</p>
        <ContactInfo className="text-neutral-600" iconStyle={themeStyle} />
      </header>

      {personalInfo.summary && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={themeStyle}>Profile</h2>
          <p className="text-sm leading-relaxed text-neutral-800 text-justify">
            {personalInfo.summary}
          </p>
        </section>
      )}

      <ExperienceSection />
      <EducationSection />
      <ProjectsSection />
      <CustomSectionsRender />
      <SkillsSection />
    </LayoutWrapper>
  );
};
