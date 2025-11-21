
import React from 'react';
import { ResumeData } from '../types';
import { MapPin, Mail, Phone, Globe, ExternalLink } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  previewRef: React.RefObject<HTMLDivElement>;
  isATSMode?: boolean;
  isEditing?: boolean;
  onUpdate?: (section: string, id: string | null, field: string, value: string) => void;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, previewRef, isATSMode = false, isEditing = false, onUpdate }) => {
  const { personalInfo, experience, education, skills, projects, customSections, themeColor, templateId = 'modern' } = data;
  
  const themeStyle = { color: isATSMode ? '#000000' : themeColor };
  const bgThemeStyle = { backgroundColor: isATSMode ? '#000000' : themeColor };
  const borderThemeStyle = { borderColor: isATSMode ? '#000000' : themeColor };

  // --- EDITABLE WRAPPER ---
  const Editable = ({ 
      value, 
      section, 
      id = null, 
      field, 
      className = "", 
      style = {},
      tag = 'div', 
      placeholder = "..." 
  }: { value: string, section: string, id?: string | null, field: string, className?: string, style?: React.CSSProperties, tag?: any, placeholder?: string }) => {
      
      if (!isEditing) return React.createElement(tag, { className, style }, value || "");

      return React.createElement(tag, {
          contentEditable: true,
          suppressContentEditableWarning: true,
          className: `${className} hover:bg-blue-50/50 outline-none focus:ring-2 focus:ring-blue-400 rounded px-0.5 -mx-0.5 transition-all cursor-text empty:before:content-[attr(placeholder)] empty:before:text-gray-300`,
          style: style,
          placeholder: placeholder,
          onBlur: (e: any) => {
              const newVal = e.currentTarget.textContent;
              if (onUpdate && newVal !== value) {
                  onUpdate(section, id, field, newVal);
              }
          }
      }, value);
  };

  // --- COMMON CONTENT RENDERERS ---
  
  const ContactInfo = ({ className = "", iconStyle = {} }) => (
    <div className={`flex flex-wrap gap-y-2 gap-x-4 text-sm ${className}`}>
        {(personalInfo.email || isEditing) && (
        <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" style={iconStyle} />
            <Editable section="personalInfo" field="email" value={personalInfo.email} placeholder="email@example.com" tag="span" />
        </div>
        )}
        {(personalInfo.phone || isEditing) && (
        <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" style={iconStyle} />
            <Editable section="personalInfo" field="phone" value={personalInfo.phone} placeholder="Phone Number" tag="span" />
        </div>
        )}
        {(personalInfo.location || isEditing) && (
        <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" style={iconStyle} />
            <Editable section="personalInfo" field="location" value={personalInfo.location} placeholder="City, Country" tag="span" />
        </div>
        )}
        {(personalInfo.website || isEditing) && (
        <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" style={iconStyle} />
            <Editable section="personalInfo" field="website" value={personalInfo.website} placeholder="website.com" tag="span" />
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
                    <Editable section="experience" id={exp.id} field="position" value={exp.position} className="font-bold text-neutral-900" tag="h3" placeholder="Position" />
                    <div className="text-xs font-medium text-neutral-500 whitespace-nowrap flex gap-1">
                        <Editable section="experience" id={exp.id} field="startDate" value={exp.startDate} tag="span" placeholder="Start" />
                        <span>—</span>
                        <Editable section="experience" id={exp.id} field="endDate" value={exp.current ? 'Present' : exp.endDate} tag="span" placeholder="End" />
                    </div>
                </div>
                <Editable section="experience" id={exp.id} field="company" value={exp.company} className="text-sm font-medium text-neutral-600 mb-2" tag="div" placeholder="Company" />
                <Editable section="experience" id={exp.id} field="description" value={exp.description} className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line pl-1" tag="div" placeholder="Description..." />
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
                    <Editable section="education" id={edu.id} field="institution" value={edu.institution} className="font-bold text-neutral-900" tag="h3" placeholder="University" />
                    <Editable section="education" id={edu.id} field="graduationDate" value={edu.graduationDate} className="text-xs font-medium text-neutral-500 whitespace-nowrap" tag="span" placeholder="Year" />
                </div>
                <div className="text-sm text-neutral-700 flex gap-1">
                    <Editable section="education" id={edu.id} field="degree" value={edu.degree} tag="span" placeholder="Degree" /> 
                    <span>in</span>
                    <Editable section="education" id={edu.id} field="field" value={edu.field} tag="span" placeholder="Field of Study" />
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
                    <div className="font-bold text-neutral-900 flex items-center gap-2">
                        <Editable section="projects" id={proj.id} field="name" value={proj.name} tag="h3" placeholder="Project Name" />
                        {proj.link && !isEditing && <ExternalLink className="w-3 h-3 text-neutral-400" />}
                    </div>
                </div>
                <Editable section="projects" id={proj.id} field="description" value={proj.description} className="text-sm text-neutral-700 leading-relaxed" tag="p" placeholder="Description..." />
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
                    <Editable section="personalInfo" field="fullName" value={personalInfo.fullName} className="text-3xl font-bold uppercase mb-2 tracking-wide block" tag="h1" placeholder="YOUR NAME" />
                    <div className="text-sm mb-2 font-medium">{personalInfo.location}</div>
                    <div className="text-sm flex flex-wrap justify-center gap-4">
                        {personalInfo.email && <span>{personalInfo.email}</span>}
                        {personalInfo.phone && <span>{personalInfo.phone}</span>}
                        {personalInfo.website && <span>{personalInfo.website}</span>}
                    </div>
                </div>
                {(personalInfo.summary || isEditing) && (
                    <div className="mb-6">
                        <h3 className="text-sm font-bold uppercase border-b border-black mb-3">Professional Summary</h3>
                        <Editable section="personalInfo" field="summary" value={personalInfo.summary} className="text-sm text-justify block" tag="p" placeholder="Summary..." />
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
  
  // 7. DEFAULT: MODERN TEMPLATE (Implementing editable for default template primarily for brevity, logic applies same to others)
  // Note: For full implementation, replace static fields in other templates with <Editable /> as well.
  return (
    <LayoutWrapper className="bg-white p-[15mm] md:p-[20mm]">
      <header className="border-b pb-6 mb-6" style={{borderColor: themeColor === '#000000' ? '#e5e5e5' : themeColor}}>
        <Editable section="personalInfo" field="fullName" value={personalInfo.fullName} className="text-4xl font-bold tracking-tight uppercase mb-2 block" style={themeStyle} tag="h1" placeholder="YOUR NAME" />
        <Editable section="personalInfo" field="jobTitle" value={personalInfo.jobTitle} className="text-xl text-neutral-500 font-medium mb-4 block" tag="p" placeholder="Target Job Title" />
        <ContactInfo className="text-neutral-600" iconStyle={themeStyle} />
      </header>

      {(personalInfo.summary || isEditing) && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={themeStyle}>Profile</h2>
          <Editable section="personalInfo" field="summary" value={personalInfo.summary} className="text-sm leading-relaxed text-neutral-800 text-justify block" tag="p" placeholder="Write a professional summary..." />
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
