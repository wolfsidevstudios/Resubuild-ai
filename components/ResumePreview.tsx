
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

  // --- SUB-COMPONENTS (Reusable logic) ---
  
  const ContactInfo = ({ className = "", iconStyle = {}, showIcons = true }) => (
    <div className={className}>
        {(personalInfo.email || isEditing) && (
        <div className="flex items-center gap-1.5">
            {showIcons && <Mail className="w-3.5 h-3.5 shrink-0" style={iconStyle} />}
            <Editable section="personalInfo" field="email" value={personalInfo.email} placeholder="email@example.com" tag="span" />
        </div>
        )}
        {(personalInfo.phone || isEditing) && (
        <div className="flex items-center gap-1.5">
            {showIcons && <Phone className="w-3.5 h-3.5 shrink-0" style={iconStyle} />}
            <Editable section="personalInfo" field="phone" value={personalInfo.phone} placeholder="Phone Number" tag="span" />
        </div>
        )}
        {(personalInfo.location || isEditing) && (
        <div className="flex items-center gap-1.5">
            {showIcons && <MapPin className="w-3.5 h-3.5 shrink-0" style={iconStyle} />}
            <Editable section="personalInfo" field="location" value={personalInfo.location} placeholder="City, Country" tag="span" />
        </div>
        )}
        {(personalInfo.website || isEditing) && (
        <div className="flex items-center gap-1.5">
            {showIcons && <Globe className="w-3.5 h-3.5 shrink-0" style={iconStyle} />}
            <Editable section="personalInfo" field="website" value={personalInfo.website} placeholder="website.com" tag="span" />
        </div>
        )}
    </div>
  );

  const ExperienceItems = ({ titleClass = "", itemClass = "mb-4", dateClass="text-sm text-neutral-500" }) => (
      experience.map(exp => (
        <div key={exp.id} className={itemClass}>
            <div className="flex justify-between items-baseline mb-1">
                <Editable section="experience" id={exp.id} field="position" value={exp.position} className={titleClass} tag="h3" placeholder="Position" />
                <div className={dateClass}>
                    <Editable section="experience" id={exp.id} field="startDate" value={exp.startDate} tag="span" placeholder="Start" />
                    <span>—</span>
                    <Editable section="experience" id={exp.id} field="endDate" value={exp.current ? 'Present' : exp.endDate} tag="span" placeholder="End" />
                </div>
            </div>
            <Editable section="experience" id={exp.id} field="company" value={exp.company} className="text-sm font-bold text-neutral-700 mb-2" tag="div" placeholder="Company" />
            <Editable section="experience" id={exp.id} field="description" value={exp.description} className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line" tag="div" placeholder="Description..." />
        </div>
      ))
  );

  // --- LAYOUT RENDERERS ---

  const RenderCreative = () => {
      // Ensure text is visible on colored sidebar
      const isDarkBg = ['#000000', '#334155', '#525252', '#737373', '#1e3a8a', '#7c3aed', '#c026d3', '#db2777', '#e11d48', '#b45309', '#0f766e', '#059669', '#16a34a'].includes(themeColor);
      const sidebarTextClass = isDarkBg ? 'text-white/90' : 'text-neutral-900';
      const sidebarTitleClass = isDarkBg ? 'text-white font-bold uppercase tracking-widest border-b border-white/20 pb-2 mb-4' : 'text-neutral-900 font-bold uppercase tracking-widest border-b border-neutral-900/20 pb-2 mb-4';

      return (
          <div className="flex min-h-[297mm]">
              {/* Left Sidebar */}
              <div className="w-[32%] p-8 shrink-0" style={{ backgroundColor: themeColor }}>
                  <div className="mb-10">
                      {/* Initials Circle */}
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-6 ${isDarkBg ? 'bg-white/10 text-white' : 'bg-black/10 text-black'}`}>
                          {personalInfo.fullName.charAt(0)}
                      </div>
                      <Editable section="personalInfo" field="fullName" value={personalInfo.fullName} className={`text-3xl font-bold leading-tight mb-2 ${isDarkBg ? 'text-white' : 'text-neutral-900'}`} tag="h1" placeholder="Name" />
                      <Editable section="personalInfo" field="jobTitle" value={personalInfo.jobTitle} className={`text-lg font-medium mb-6 ${isDarkBg ? 'text-white/80' : 'text-neutral-700'}`} tag="p" placeholder="Role" />
                      
                      <ContactInfo className={`text-sm space-y-3 ${sidebarTextClass}`} iconStyle={{ color: isDarkBg ? 'white' : 'black' }} />
                  </div>

                  {skills.length > 0 && (
                      <div className="mb-10">
                          <h3 className={sidebarTitleClass}>Skills</h3>
                          <div className="flex flex-wrap gap-2">
                              {skills.map((skill, i) => (
                                  <span key={i} className={`px-2 py-1 rounded text-xs font-medium ${isDarkBg ? 'bg-white/20 text-white' : 'bg-black/10 text-neutral-900'}`}>{skill}</span>
                              ))}
                          </div>
                      </div>
                  )}

                  {education.length > 0 && (
                      <div>
                          <h3 className={sidebarTitleClass}>Education</h3>
                          <div className="space-y-4">
                              {education.map(edu => (
                                  <div key={edu.id} className={sidebarTextClass}>
                                      <div className="font-bold text-sm">{edu.degree}</div>
                                      <div className="text-xs opacity-80">{edu.institution}</div>
                                      <div className="text-xs opacity-60">{edu.graduationDate}</div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
              </div>

              {/* Main Content */}
              <div className="flex-1 p-10 bg-white text-neutral-900">
                  {personalInfo.summary && (
                      <div className="mb-10">
                          <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4">Profile</h2>
                          <Editable section="personalInfo" field="summary" value={personalInfo.summary} className="text-sm leading-relaxed text-neutral-700" tag="p" />
                      </div>
                  )}

                  {experience.length > 0 && (
                      <div className="mb-10">
                          <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6">Experience</h2>
                          <ExperienceItems titleClass="text-lg font-bold text-neutral-900" itemClass="mb-8" />
                      </div>
                  )}

                  {projects.length > 0 && (
                      <div className="mb-10">
                          <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6">Projects</h2>
                          {projects.map(p => (
                              <div key={p.id} className="mb-6">
                                  <div className="font-bold text-neutral-900 mb-1">{p.name}</div>
                                  <Editable section="projects" id={p.id} field="description" value={p.description} className="text-sm text-neutral-700" tag="p" />
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          </div>
      );
  };

  const RenderProfessional = () => {
      const fontStyle = { fontFamily: 'Georgia, "Times New Roman", Times, serif' };
      
      return (
          <div className="p-[20mm]" style={fontStyle}>
              <header className="border-b-2 border-neutral-900 pb-6 mb-8 text-center">
                  <Editable section="personalInfo" field="fullName" value={personalInfo.fullName} className="text-4xl font-bold uppercase tracking-wide mb-3 block" tag="h1" />
                  <div className="flex justify-center gap-4 text-sm text-neutral-700">
                      <ContactInfo className="flex gap-4 flex-wrap justify-center" showIcons={false} />
                  </div>
              </header>

              {personalInfo.summary && (
                  <section className="mb-8">
                      <h2 className="text-base font-bold uppercase border-b border-neutral-300 mb-3 pb-1">Professional Summary</h2>
                      <Editable section="personalInfo" field="summary" value={personalInfo.summary} className="text-sm leading-relaxed text-justify block" tag="p" />
                  </section>
              )}

              {experience.length > 0 && (
                  <section className="mb-8">
                      <h2 className="text-base font-bold uppercase border-b border-neutral-300 mb-4 pb-1">Work Experience</h2>
                      {experience.map(exp => (
                          <div key={exp.id} className="mb-5">
                              <div className="flex justify-between items-baseline font-bold text-neutral-900">
                                  <div className="text-lg">{exp.company}</div>
                                  <div className="text-sm italic">
                                      <Editable section="experience" id={exp.id} field="startDate" value={exp.startDate} tag="span" /> - <Editable section="experience" id={exp.id} field="endDate" value={exp.current ? 'Present' : exp.endDate} tag="span" />
                                  </div>
                              </div>
                              <div className="text-base font-semibold italic mb-2">{exp.position}</div>
                              <Editable section="experience" id={exp.id} field="description" value={exp.description} className="text-sm leading-relaxed text-justify pl-4 border-l-2 border-neutral-100" tag="div" />
                          </div>
                      ))}
                  </section>
              )}

              {education.length > 0 && (
                  <section className="mb-8">
                      <h2 className="text-base font-bold uppercase border-b border-neutral-300 mb-4 pb-1">Education</h2>
                      {education.map(edu => (
                          <div key={edu.id} className="mb-2 flex justify-between">
                              <div>
                                  <div className="font-bold">{edu.institution}</div>
                                  <div className="text-sm italic">{edu.degree} in {edu.field}</div>
                              </div>
                              <div className="text-sm font-bold">{edu.graduationDate}</div>
                          </div>
                      ))}
                  </section>
              )}
              
              {skills.length > 0 && (
                  <section>
                      <h2 className="text-base font-bold uppercase border-b border-neutral-300 mb-3 pb-1">Skills</h2>
                      <p className="text-sm leading-relaxed">{skills.join(' • ')}</p>
                  </section>
              )}
          </div>
      );
  };

  const RenderMinimal = () => {
      return (
          <div className="p-[20mm] max-w-3xl mx-auto text-center">
              <header className="mb-12">
                  <Editable section="personalInfo" field="fullName" value={personalInfo.fullName} className="text-4xl font-light tracking-tight mb-2 block" tag="h1" />
                  <Editable section="personalInfo" field="jobTitle" value={personalInfo.jobTitle} className="text-lg text-neutral-400 font-medium mb-6 block" tag="p" />
                  <ContactInfo className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-neutral-500" iconStyle={{ width: 14, height: 14 }} />
              </header>

              <div className="text-left space-y-12">
                  {personalInfo.summary && (
                      <section>
                          <Editable section="personalInfo" field="summary" value={personalInfo.summary} className="text-base leading-relaxed text-neutral-600 text-center max-w-2xl mx-auto" tag="p" />
                      </section>
                  )}

                  {experience.length > 0 && (
                      <section>
                          <div className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 text-center mb-8">Experience</div>
                          <div className="space-y-10 relative before:absolute before:inset-0 before:ml-1/2 before:-translate-x-px before:bg-neutral-100 before:w-px before:hidden md:before:block">
                              {experience.map(exp => (
                                  <div key={exp.id} className="relative z-10 bg-white p-4 rounded-xl border border-neutral-50 shadow-sm">
                                      <div className="text-sm text-neutral-400 mb-1 font-medium">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</div>
                                      <div className="text-lg font-bold text-neutral-900">{exp.position}</div>
                                      <div className="text-base text-neutral-600 mb-4">{exp.company}</div>
                                      <Editable section="experience" id={exp.id} field="description" value={exp.description} className="text-sm text-neutral-600 leading-relaxed" tag="div" />
                                  </div>
                              ))}
                          </div>
                      </section>
                  )}
                  
                  {skills.length > 0 && (
                      <section className="text-center">
                          <div className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 mb-6">Expertise</div>
                          <div className="flex flex-wrap justify-center gap-3">
                              {skills.map((skill, i) => (
                                  <span key={i} className="px-4 py-2 bg-neutral-50 rounded-full text-sm text-neutral-600">{skill}</span>
                              ))}
                          </div>
                      </section>
                  )}
              </div>
          </div>
      );
  };

  const RenderElegant = () => {
      // Serif layout with centered headers and thin lines
      return (
          <div className="p-[20mm]" style={{ fontFamily: 'Garamond, Georgia, serif' }}>
              <header className="text-center mb-10">
                  <div className="inline-block border-b border-neutral-300 pb-6 px-10 mb-6">
                      <Editable section="personalInfo" field="fullName" value={personalInfo.fullName} className="text-5xl mb-2 block" style={{ color: themeColor }} tag="h1" />
                      <Editable section="personalInfo" field="jobTitle" value={personalInfo.jobTitle} className="text-xl text-neutral-500 italic block" tag="p" />
                  </div>
                  <ContactInfo className="flex justify-center gap-6 text-neutral-600 text-sm" showIcons={false} />
              </header>

              <div className="grid grid-cols-1 gap-10">
                  {personalInfo.summary && (
                      <section>
                          <h2 className="text-center text-sm uppercase tracking-widest font-bold text-neutral-400 mb-4">About Me</h2>
                          <Editable section="personalInfo" field="summary" value={personalInfo.summary} className="text-center text-lg leading-relaxed text-neutral-700 max-w-3xl mx-auto" tag="p" />
                      </section>
                  )}

                  {experience.length > 0 && (
                      <section>
                          <h2 className="text-center text-sm uppercase tracking-widest font-bold text-neutral-400 mb-8">Experience</h2>
                          {experience.map(exp => (
                              <div key={exp.id} className="mb-8 flex flex-col md:flex-row gap-6">
                                  <div className="w-48 text-right shrink-0 pt-1">
                                      <div className="font-bold text-lg">{exp.company}</div>
                                      <div className="text-sm text-neutral-500 italic">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                                  </div>
                                  <div className="flex-1 border-l border-neutral-200 pl-6 pt-1">
                                      <div className="text-xl font-medium mb-2" style={{ color: themeColor }}>{exp.position}</div>
                                      <Editable section="experience" id={exp.id} field="description" value={exp.description} className="text-base text-neutral-600 leading-relaxed" tag="div" />
                                  </div>
                              </div>
                          ))}
                      </section>
                  )}
              </div>
          </div>
      );
  };

  // --- RENDER SWITCHER ---

  const renderLayout = () => {
      if (isATSMode) {
          // Simplified ATS layout
          return (
            <div className="p-[20mm] font-serif bg-white">
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
                    <RenderProfessional /> {/* Reuse professional mostly for ATS but stripped */}
                </div>
            </div>
          );
      }

      switch(templateId) {
          case 'creative': return <RenderCreative />;
          case 'professional': return <RenderProfessional />;
          case 'minimal': return <RenderMinimal />;
          case 'elegant': return <RenderElegant />;
          case 'tech': return <RenderProfessional />; // Fallback for now or distinct
          default: 
              // MODERN (Default)
              return (
                <div className="p-[15mm] md:p-[20mm]">
                  <header className="border-b pb-6 mb-6" style={{borderColor: themeColor === '#000000' ? '#e5e5e5' : themeColor}}>
                    <Editable section="personalInfo" field="fullName" value={personalInfo.fullName} className="text-4xl font-bold tracking-tight uppercase mb-2 block" style={{ color: themeColor }} tag="h1" placeholder="YOUR NAME" />
                    <Editable section="personalInfo" field="jobTitle" value={personalInfo.jobTitle} className="text-xl text-neutral-500 font-medium mb-4 block" tag="p" placeholder="Target Job Title" />
                    <ContactInfo className="text-neutral-600 flex gap-4 text-sm" iconStyle={{ color: themeColor }} />
                  </header>

                  {(personalInfo.summary || isEditing) && (
                    <section className="mb-8">
                      <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: themeColor }}>Profile</h2>
                      <Editable section="personalInfo" field="summary" value={personalInfo.summary} className="text-sm leading-relaxed text-neutral-800 text-justify block" tag="p" placeholder="Write a professional summary..." />
                    </section>
                  )}

                  {experience.length > 0 && (
                      <section className="mb-8">
                          <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: themeColor }}>Experience</h2>
                          <ExperienceItems titleClass="font-bold text-neutral-900" />
                      </section>
                  )}
                  
                  {skills.length > 0 && (
                      <section className="mb-8">
                          <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: themeColor }}>Skills</h2>
                          <div className="flex flex-wrap gap-2">
                              {skills.map((skill, idx) => (
                                  <span key={idx} className="text-xs font-medium px-2.5 py-1 rounded-md border bg-neutral-100 text-neutral-800 border-neutral-200">
                                      {skill}
                                  </span>
                              ))}
                          </div>
                      </section>
                  )}
                  
                  {/* Add Education, Projects, Custom similarly reused or inline */}
                  {/* For brevity, assuming standard vertical list for others in Modern */}
                  {education.length > 0 && (
                      <section className="mb-8">
                          <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: themeColor }}>Education</h2>
                          {education.map(edu => (
                              <div key={edu.id} className="mb-4">
                                  <div className="flex justify-between items-baseline mb-1">
                                      <div className="font-bold text-neutral-900">{edu.institution}</div>
                                      <div className="text-xs text-neutral-500">{edu.graduationDate}</div>
                                  </div>
                                  <div className="text-sm text-neutral-700">{edu.degree}</div>
                              </div>
                          ))}
                      </section>
                  )}
                </div>
              );
      }
  };

  return (
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
                className={`bg-white w-full min-h-[297mm] print-layout text-neutral-900 ${isATSMode ? '' : ''}`}
            >
                {renderLayout()}
            </div>
        </div>
    </div>
  );
};
