"use client";
import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Loader2, BookOpen, FileText, Layers } from "lucide-react"
import { ReferenceProp, ReferenceType } from"@/redux/types/community";
import { useGetModulesQuery } from "@/redux/slices/admin/modules.slice";
import { useListLearnModulesQuery, useListTopicsQuery } from "@/redux/slices/learn.slice";
import { generateSlug } from "@/utils/function";
import { SubTopic, TopicWithSubTopics } from "@/redux/slices/types";



export interface ReferenceSelectorProps {
  value: ReferenceProp | null;
  onChange: (reference: {
    type: ReferenceType;
    id: string;
    title: string;
    moduleId?: string;
    topicId?: string;
    moduleTitle?: string;
    topicTitle?: string;
  } | null) => void;
}

interface Module {
  _id: string;
  title: string;
  category: string;
  description: string;
}

export default function ReferenceSelector({ value, onChange }: ReferenceSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicWithSubTopics | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<SubTopic | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [topics, setTopics] = useState<TopicWithSubTopics[]>([]);
  const [subtopics, setSubtopics] = useState<SubTopic[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [isLoadingSubtopics, setIsLoadingSubtopics] = useState(false);
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [showSubtopicDropdown, setShowSubtopicDropdown] = useState(false);

  // Fetch modules
  const { data: modulesData, isLoading: modulesLoading } = useListLearnModulesQuery({
    pageSize: 50,
  });
  const { data: moduleTopics } = useListTopicsQuery({ moduleId: selectedModule?._id }, {skip: !selectedModule?._id})

  useEffect(() => {
    if (modulesData?.data) {
      setModules(modulesData.data.data);
    }
  }, [modulesData]);

  // Filter modules by search
  const filteredModules = modules.filter(module =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch topics when module is selected
  const fetchTopics = async (moduleId: string) => {
    setIsLoadingTopics(true);
    try {
      if (moduleTopics?.success) {
        setTopics(moduleTopics.data);
      }
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    } finally {
      setIsLoadingTopics(false);
    }
  };

  console.log(subtopics)

  // Fetch subtopics when topic is selected
  const fetchSubtopics = async (getSubTopic: SubTopic[]) => {
    try {
      if (moduleTopics?.success) {
        setSubtopics(getSubTopic || []);
      }
    } catch (error) {
      console.error("Failed to fetch subtopics:", error);
    } finally {
    }
  };

  // Handle module selection
  const handleModuleSelect = (module: Module) => {
    setSelectedModule(module);
    setSelectedTopic(null);
    setSelectedSubtopic(null);
    setTopics([]);
    setSubtopics([]);
    setShowModuleDropdown(false);
    setSearchTerm("");
    fetchTopics(module._id);
    
    onChange({
      type: 'module',
      id: module._id,
      title: module.title,
      moduleId: module._id,
      moduleTitle: module.title,
    });
  };

  console.log({selectedTopic, topics})

  // Handle topic selection
  const handleTopicSelect = (topic: TopicWithSubTopics) => {
    setSelectedTopic(topic);
    setSelectedSubtopic(null);
    setSubtopics([]);
    setShowTopicDropdown(false);

    const getSubTopic = topics.filter((e:any) => e?.id === topic?.id)?.[0]?.subtopics
    console.log({getSubTopic, topics, topic})
    fetchSubtopics(getSubTopic);
    
    onChange({
      type: 'topic',
      id: topic.id,
      title: topic.title,
      moduleId: selectedModule?._id,
      moduleTitle: selectedModule?.title,
      topicId: topic.id,
      topicTitle: topic.title,
    });
  };

  // Handle subtopic selection
  const handleSubtopicSelect = (subtopic: SubTopic) => {
    setSelectedSubtopic(subtopic);
    setShowSubtopicDropdown(false);
    
    onChange({
      type: 'subtopic',
      id: subtopic.id,
      title: subtopic.title,
      moduleId: selectedModule?._id,
      moduleTitle: selectedModule?.title,
      topicId: selectedTopic?.id,
      topicTitle: selectedTopic?.title,
    });
  };

  // Clear reference
  const handleClear = () => {
    setSelectedModule(null);
    setSelectedTopic(null);
    setSelectedSubtopic(null);
    setTopics([]);
    setSubtopics([]);
    onChange(null);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Link to a Module/Topic/Subtopic (Optional)
      </label>

      {/* Selected Reference Display */}
      {value && (
        <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs text-blue-600 mb-1">
                {value.type === 'module' && <BookOpen size={12} />}
                {value.type === 'topic' && <FileText size={12} />}
                {value.type === 'subtopic' && <Layers size={12} />}
                <span className="uppercase font-semibold">{value.type}</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{value.title}</p>
              {value.title && value.type !== 'module' && (
                <p className="text-xs text-gray-500 mt-1">
                  in {value.title}{value.topicTitle ? ` › ${value.topicTitle}` : ''}
                </p>
              )}
            </div>
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Module Selection */}
      {!value && (
        <div className="relative">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for a module..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowModuleDropdown(true)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-maroon-500"
            />
            {modulesLoading && (
              <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400" />
            )}
          </div>

          {showModuleDropdown && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredModules.length === 0 ? (
                <div className="p-3 text-center text-gray-500 text-sm">
                  No modules found
                </div>
              ) : (
                filteredModules.map((module) => (
                  <button
                    key={module._id}
                    onClick={() => handleModuleSelect(module)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen size={14} className="text-maroon-500" />
                      <span className="text-sm font-medium text-gray-900">{module.title}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 ml-6">{module.category}</p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Topic Selection (shown after module is selected) */}
      {selectedModule && !value?.topicId && (
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500">Selected Module:</span>
            <span className="text-xs font-medium text-gray-900">{selectedModule.title}</span>
            <button
              onClick={() => {
                setSelectedModule(null);
                setTopics([]);
                setSearchTerm("");
              }}
              className="text-xs text-red-500 hover:text-red-600"
            >
              Change
            </button>
          </div>
          
          <div className="relative">
            <div
              onClick={() => setShowTopicDropdown(!showTopicDropdown)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:border-maroon-500 transition-colors flex items-center justify-between"
            >
              <span className={selectedTopic ? "text-gray-900" : "text-gray-400"}>
                {selectedTopic ? selectedTopic.title : "Select a topic..."}
              </span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
            
            {showTopicDropdown && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {isLoadingTopics ? (
                  <div className="p-3 text-center text-gray-500 text-sm">
                    <Loader2 size={14} className="animate-spin inline mr-2" />
                    Loading topics...
                  </div>
                ) : topics.length === 0 ? (
                  <div className="p-3 text-center text-gray-500 text-sm">
                    No topics found in this module
                  </div>
                ) : (
                  topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicSelect(topic)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-700">{topic.title}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subtopic Selection (shown after topic is selected) */}
      {selectedTopic && (
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500">Selected Topic:</span>
            <span className="text-xs font-medium text-gray-900">{selectedTopic.title}</span>
            <button
              onClick={() => {
                setSelectedTopic(null);
                setSubtopics([]);
              }}
              className="text-xs text-red-500 hover:text-red-600"
            >
              Change
            </button>
          </div>
          
          <div className="relative">
            <div
              onClick={() => setShowSubtopicDropdown(!showSubtopicDropdown)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:border-maroon-500 transition-colors flex items-center justify-between"
            >
              <span className={selectedSubtopic ? "text-gray-900" : "text-gray-400"}>
                {selectedSubtopic ? selectedSubtopic.title : "Select a subtopic (optional)..."}
              </span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
            
            {showSubtopicDropdown && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <>
                    <button
                      onClick={() => {
                        setSelectedSubtopic(null);
                        setShowSubtopicDropdown(false);
                        onChange({
                          type: 'topic',
                          id: selectedTopic.id,
                          title: selectedTopic.title,
                          moduleId: selectedModule?._id,
                          moduleTitle: selectedModule?.title,
                          topicId: selectedTopic.id,
                          topicTitle: selectedTopic.title,
                        });
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors border-b border-gray-100 text-sm text-gray-500 italic"
                    >
                      Skip (link to topic only)
                    </button>
                    {subtopics.map((subtopic) => (
                      <button
                        key={subtopic.id}
                        onClick={() => handleSubtopicSelect(subtopic)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <Layers size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-700">{subtopic.title}</span>
                          <span className="text-xs text-gray-400 ml-auto">{subtopic.duration}</span>
                        </div>
                      </button>
                    ))}
                  </>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preview Link */}
      {value && (
        <div className="mt-2">
          <a
            href={`/dashboard/learn/${value.type === 'module' ? generateSlug(value.moduleTitle) : `${generateSlug(value.moduleTitle)}/${generateSlug(value.topicTitle)}`}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-maroon-500 hover:underline flex items-center gap-1"
          >
            <BookOpen size={10} /> View referenced content
          </a>
        </div>
      )}
    </div>
  );
}