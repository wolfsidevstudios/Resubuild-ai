
import React, { useState } from 'react';
import { Trash2, Plus, ChevronDown, ChevronUp, Sparkles, Briefcase, GraduationCap, FolderGit2, Layers } from 'lucide-react';
import { Button } from './Button';
import { Input, TextArea } from './InputField';
import { Experience, Education, Project, CustomSectionItem } from '../types';

interface ExperienceEditorProps {
  items: Experience[];
  onChange: (items: Experience[]) => void;
  onImprove: (id: string, text: string, title: string) => Promise<void>;
  isImproving: string | null;
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ items, onChange, onImprove, isImproving }) => {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);

  const addExperience = () => {
    const newItem: Experience = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    onChange([newItem, ...items]);
    setExpandedId(newItem.id);
  };

  const updateItem = (id: string, field: keyof Experience, value: any) => {
    onChange(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-neutral-800">
          <Briefcase className="w-5 h-5" /> Experience
        </h3>
        <Button onClick={addExperience} variant="secondary" icon={<Plus className="w-4 h-4" />}>
          Add Position
        </Button>
      </div>
      
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-neutral-200 rounded-2xl overflow-hidden transition-all hover:shadow-md">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer bg-neutral-50/50"
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              <div className="font-medium text-neutral-900">
                {item.position || '(New Position)'} <span className="text-neutral-400 mx-2">at</span> {item.company || '...'}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                  className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {expandedId === item.id ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
              </div>
            </div>

            {expandedId === item.id && (
              <div className="p-5 border-t border-neutral-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Job Title" 
                    value={item.position} 
                    onChange={(e) => updateItem(item.id, 'position', e.target.value)} 
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                  <Input 
                    label="Company" 
                    value={item.company} 
                    onChange={(e) => updateItem(item.id, 'company', e.target.value)} 
                    placeholder="e.g. Google"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Start Date" 
                    value={item.startDate} 
                    onChange={(e) => updateItem(item.id, 'startDate', e.target.value)} 
                    placeholder="MMM YYYY"
                  />
                  <div className="flex flex-col">
                    <Input 
                      label="End Date" 
                      value={item.endDate} 
                      disabled={item.current}
                      onChange={(e) => updateItem(item.id, 'endDate', e.target.value)} 
                      placeholder={item.current ? 'Present' : 'MMM YYYY'}
                    />
                    <label className="flex items-center mt-2 text-sm text-neutral-600 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={item.current} 
                        onChange={(e) => updateItem(item.id, 'current', e.target.checked)}
                        className="mr-2 rounded border-gray-300 text-neutral-900 focus:ring-neutral-900"
                      />
                      I currently work here
                    </label>
                  </div>
                </div>
                
                <div className="relative">
                  <TextArea 
                    label="Description" 
                    value={item.description} 
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="• Led development of..."
                    className="min-h-[150px]"
                  />
                  <div className="absolute bottom-3 right-3">
                    <Button 
                      variant="primary" 
                      onClick={() => onImprove(item.id, item.description, item.position)}
                      isLoading={isImproving === item.id}
                      icon={<Sparkles className="w-3 h-3" />}
                      className="text-xs py-1.5 px-3 bg-black"
                    >
                      AI Enhance
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface EducationEditorProps {
  items: Education[];
  onChange: (items: Education[]) => void;
}

export const EducationEditor: React.FC<EducationEditorProps> = ({ items, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);

  const addEducation = () => {
    const newItem: Education = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      field: '',
      graduationDate: ''
    };
    onChange([newItem, ...items]);
    setExpandedId(newItem.id);
  };

  const updateItem = (id: string, field: keyof Education, value: any) => {
    onChange(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4">
       <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-neutral-800">
          <GraduationCap className="w-5 h-5" /> Education
        </h3>
        <Button onClick={addEducation} variant="secondary" icon={<Plus className="w-4 h-4" />}>
          Add School
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-neutral-200 rounded-2xl overflow-hidden transition-all hover:shadow-md">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer bg-neutral-50/50"
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
               <div className="font-medium text-neutral-900">
                {item.institution || '(New School)'}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                  className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {expandedId === item.id ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
              </div>
            </div>
            
            {expandedId === item.id && (
              <div className="p-5 border-t border-neutral-100 space-y-4">
                <Input 
                  label="Institution / University" 
                  value={item.institution} 
                  onChange={(e) => updateItem(item.id, 'institution', e.target.value)} 
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Degree" 
                    value={item.degree} 
                    onChange={(e) => updateItem(item.id, 'degree', e.target.value)} 
                    placeholder="e.g. Bachelor's"
                  />
                  <Input 
                    label="Field of Study" 
                    value={item.field} 
                    onChange={(e) => updateItem(item.id, 'field', e.target.value)} 
                    placeholder="e.g. Computer Science"
                  />
                </div>
                <Input 
                    label="Graduation Date" 
                    value={item.graduationDate} 
                    onChange={(e) => updateItem(item.id, 'graduationDate', e.target.value)} 
                    placeholder="MMM YYYY"
                  />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


interface ProjectEditorProps {
  items: Project[];
  onChange: (items: Project[]) => void;
}

export const ProjectEditor: React.FC<ProjectEditorProps> = ({ items, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);

  const addProject = () => {
    const newItem: Project = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      link: ''
    };
    onChange([newItem, ...items]);
    setExpandedId(newItem.id);
  };

  const updateItem = (id: string, field: keyof Project, value: any) => {
    onChange(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4">
       <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-neutral-800">
          <FolderGit2 className="w-5 h-5" /> Projects
        </h3>
        <Button onClick={addProject} variant="secondary" icon={<Plus className="w-4 h-4" />}>
          Add Project
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-neutral-200 rounded-2xl overflow-hidden transition-all hover:shadow-md">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer bg-neutral-50/50"
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
               <div className="font-medium text-neutral-900">
                {item.name || '(New Project)'}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                  className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {expandedId === item.id ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
              </div>
            </div>
            
            {expandedId === item.id && (
              <div className="p-5 border-t border-neutral-100 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Project Name" 
                    value={item.name} 
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)} 
                  />
                  <Input 
                    label="Link (Optional)" 
                    value={item.link} 
                    onChange={(e) => updateItem(item.id, 'link', e.target.value)} 
                    placeholder="github.com/..."
                  />
                </div>
                <TextArea 
                  label="Description" 
                  value={item.description} 
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)} 
                  placeholder="Describe what you built..."
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface CustomSectionEditorProps {
  title: string;
  items: CustomSectionItem[];
  onChange: (items: CustomSectionItem[]) => void;
  onDeleteSection: () => void;
}

export const CustomSectionEditor: React.FC<CustomSectionEditorProps> = ({ title, items, onChange, onDeleteSection }) => {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);

  const addItem = () => {
    const newItem: CustomSectionItem = {
      id: crypto.randomUUID(),
      title: '',
      subtitle: '',
      date: '',
      description: ''
    };
    onChange([newItem, ...items]);
    setExpandedId(newItem.id);
  };

  const updateItem = (id: string, field: keyof CustomSectionItem, value: any) => {
    onChange(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4">
       <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-neutral-800">
          <Layers className="w-5 h-5" /> {title}
        </h3>
        <div className="flex gap-2">
          <button 
             onClick={onDeleteSection}
             className="text-xs text-red-500 hover:text-red-700 font-medium px-2"
          >
             Delete Section
          </button>
          <Button onClick={addItem} variant="secondary" icon={<Plus className="w-4 h-4" />}>
            Add Item
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-neutral-200 rounded-2xl overflow-hidden transition-all hover:shadow-md">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer bg-neutral-50/50"
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
               <div className="font-medium text-neutral-900">
                {item.title || '(New Item)'}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                  className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {expandedId === item.id ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
              </div>
            </div>
            
            {expandedId === item.id && (
              <div className="p-5 border-t border-neutral-100 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Title" 
                    value={item.title} 
                    onChange={(e) => updateItem(item.id, 'title', e.target.value)} 
                    placeholder="Item Name"
                  />
                  <Input 
                    label="Subtitle" 
                    value={item.subtitle} 
                    onChange={(e) => updateItem(item.id, 'subtitle', e.target.value)} 
                    placeholder="Role / Organization"
                  />
                </div>
                <Input 
                    label="Date / Duration" 
                    value={item.date} 
                    onChange={(e) => updateItem(item.id, 'date', e.target.value)} 
                    placeholder="e.g. 2023"
                />
                <TextArea 
                  label="Description" 
                  value={item.description} 
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)} 
                />
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && (
            <div className="text-center py-8 text-neutral-400 border-2 border-dashed border-neutral-100 rounded-2xl">
                No items in this section yet.
            </div>
        )}
      </div>
    </div>
  );
};
