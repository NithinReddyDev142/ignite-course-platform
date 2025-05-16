
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Course, Module, Lesson } from "@/lib/types";
import { Plus, X, Trash, ArrowUp, ArrowDown, Save } from "lucide-react";

const CourseCreate = () => {
  const { createCourse } = useApp();
  const navigate = useNavigate();
  
  const [selectedTab, setSelectedTab] = useState("basic");
  const [formData, setFormData] = useState<Partial<Course>>({
    title: "",
    description: "",
    thumbnail: "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y291cnNlfGVufDB8fDB8fHww",
    duration: "",
    category: "",
    modules: [],
  });
  
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [
        ...(prev.modules || []),
        {
          id: `module${Date.now()}`,
          title: `Module ${(prev.modules?.length || 0) + 1}`,
          lessons: []
        }
      ]
    }));
  };
  
  const editModule = (index: number) => {
    setCurrentModuleIndex(index);
  };
  
  const updateModuleTitle = (index: number, title: string) => {
    setFormData(prev => {
      const updatedModules = [...(prev.modules || [])];
      updatedModules[index] = { ...updatedModules[index], title };
      return { ...prev, modules: updatedModules };
    });
  };
  
  const removeModule = (index: number) => {
    setFormData(prev => {
      const updatedModules = [...(prev.modules || [])];
      updatedModules.splice(index, 1);
      return { ...prev, modules: updatedModules };
    });
    
    if (currentModuleIndex === index) {
      setCurrentModuleIndex(null);
    } else if (currentModuleIndex !== null && currentModuleIndex > index) {
      setCurrentModuleIndex(currentModuleIndex - 1);
    }
  };
  
  const moveModuleUp = (index: number) => {
    if (index <= 0) return;
    
    setFormData(prev => {
      const updatedModules = [...(prev.modules || [])];
      [updatedModules[index - 1], updatedModules[index]] = [updatedModules[index], updatedModules[index - 1]];
      return { ...prev, modules: updatedModules };
    });
    
    if (currentModuleIndex === index) {
      setCurrentModuleIndex(index - 1);
    } else if (currentModuleIndex === index - 1) {
      setCurrentModuleIndex(index);
    }
  };
  
  const moveModuleDown = (index: number) => {
    if (!formData.modules || index >= formData.modules.length - 1) return;
    
    setFormData(prev => {
      const updatedModules = [...(prev.modules || [])];
      [updatedModules[index], updatedModules[index + 1]] = [updatedModules[index + 1], updatedModules[index]];
      return { ...prev, modules: updatedModules };
    });
    
    if (currentModuleIndex === index) {
      setCurrentModuleIndex(index + 1);
    } else if (currentModuleIndex === index + 1) {
      setCurrentModuleIndex(index);
    }
  };
  
  const addLesson = (moduleIndex: number) => {
    setFormData(prev => {
      const updatedModules = [...(prev.modules || [])];
      const module = updatedModules[moduleIndex];
      const updatedLessons = [
        ...(module.lessons || []),
        {
          id: `lesson${Date.now()}`,
          title: `Lesson ${(module.lessons?.length || 0) + 1}`,
          content: "",
          duration: "10 minutes",
        }
      ];
      
      updatedModules[moduleIndex] = { ...module, lessons: updatedLessons };
      return { ...prev, modules: updatedModules };
    });
  };
  
  const updateLesson = (moduleIndex: number, lessonIndex: number, lessonData: Partial<Lesson>) => {
    setFormData(prev => {
      const updatedModules = [...(prev.modules || [])];
      const updatedLessons = [...(updatedModules[moduleIndex].lessons || [])];
      
      updatedLessons[lessonIndex] = {
        ...updatedLessons[lessonIndex],
        ...lessonData
      };
      
      updatedModules[moduleIndex] = {
        ...updatedModules[moduleIndex],
        lessons: updatedLessons
      };
      
      return { ...prev, modules: updatedModules };
    });
  };
  
  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    setFormData(prev => {
      const updatedModules = [...(prev.modules || [])];
      const updatedLessons = [...(updatedModules[moduleIndex].lessons || [])];
      
      updatedLessons.splice(lessonIndex, 1);
      
      updatedModules[moduleIndex] = {
        ...updatedModules[moduleIndex],
        lessons: updatedLessons
      };
      
      return { ...prev, modules: updatedModules };
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title?.trim()) {
      toast.error("Course title is required");
      setSelectedTab("basic");
      return;
    }
    
    if (!formData.description?.trim()) {
      toast.error("Course description is required");
      setSelectedTab("basic");
      return;
    }
    
    if (!formData.duration?.trim()) {
      toast.error("Course duration is required");
      setSelectedTab("basic");
      return;
    }
    
    if (!formData.category?.trim()) {
      toast.error("Course category is required");
      setSelectedTab("basic");
      return;
    }
    
    if (!formData.modules?.length) {
      toast.error("Add at least one module to your course");
      setSelectedTab("content");
      return;
    }
    
    // Check if modules have at least one lesson
    const emptyModules = formData.modules.filter(module => !module.lessons.length);
    if (emptyModules.length) {
      toast.error(`Module "${emptyModules[0].title}" has no lessons`);
      setSelectedTab("content");
      return;
    }
    
    try {
      createCourse(formData);
      navigate("/courses");
    } catch (error) {
      toast.error("Failed to create course");
      console.error(error);
    }
  };
  
  const categoriesList = [
    "Web Development",
    "Programming",
    "Data Science",
    "Machine Learning",
    "Design",
    "Business",
    "Marketing",
    "Photography",
    "Music",
    "Health & Fitness",
    "Language",
    "Other"
  ];

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Create New Course</h1>
          <Button onClick={handleSubmit}>
            <Save className="mr-2 h-4 w-4" />
            Save Course
          </Button>
        </div>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="content">Course Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., Introduction to Web Development"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your course..."
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        name="duration"
                        placeholder="e.g., 6 weeks"
                        value={formData.duration}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select 
                        id="category" 
                        name="category" 
                        value={formData.category}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="" disabled>Select a category</option>
                        {categoriesList.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">Thumbnail URL</Label>
                    <Input
                      id="thumbnail"
                      name="thumbnail"
                      placeholder="https://example.com/thumbnail.jpg"
                      value={formData.thumbnail}
                      onChange={handleInputChange}
                    />
                    
                    {formData.thumbnail && (
                      <div className="mt-2 border rounded-md p-2 w-full max-w-xs">
                        <img 
                          src={formData.thumbnail} 
                          alt="Course thumbnail preview"
                          className="w-full h-auto rounded"
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            e.currentTarget.src = "https://via.placeholder.com/300x150?text=Invalid+Image+URL";
                          }}
                        />
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button onClick={() => setSelectedTab("content")}>
                Next Step
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="content">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Modules</h3>
                      <Button size="sm" variant="outline" onClick={addModule}>
                        <Plus className="h-4 w-4 mr-1" /> Add Module
                      </Button>
                    </div>
                    
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                      {formData.modules?.map((module, index) => (
                        <div
                          key={module.id}
                          className={`border rounded-md p-3 cursor-pointer transition-colors ${
                            currentModuleIndex === index ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                          }`}
                          onClick={() => editModule(index)}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium truncate">{module.title}</span>
                            
                            <div className="flex items-center space-x-1">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveModuleUp(index);
                                }}
                                disabled={index === 0}
                                className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </button>
                              
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveModuleDown(index);
                                }}
                                disabled={!formData.modules || index === formData.modules.length - 1}
                                className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </button>
                              
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm('Are you sure you want to delete this module?')) {
                                    removeModule(index);
                                  }
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="text-xs text-muted-foreground mt-1">
                            {module.lessons?.length || 0} lesson{module.lessons?.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      ))}
                      
                      {(!formData.modules || formData.modules.length === 0) && (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No modules yet.</p>
                          <p>Click "Add Module" to get started.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                {currentModuleIndex !== null && formData.modules && formData.modules[currentModuleIndex] ? (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-4">
                        Edit Module: {formData.modules[currentModuleIndex].title}
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="moduleTitle">Module Title</Label>
                          <Input
                            id="moduleTitle"
                            value={formData.modules[currentModuleIndex].title}
                            onChange={(e) => updateModuleTitle(currentModuleIndex, e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Lessons</h4>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => addLesson(currentModuleIndex)}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add Lesson
                          </Button>
                        </div>
                        
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                          {formData.modules[currentModuleIndex].lessons?.map((lesson, lessonIndex) => (
                            <div key={lesson.id} className="border rounded-md p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div className="space-y-2 flex-grow mr-4">
                                  <Label htmlFor={`lesson-${lessonIndex}-title`}>Lesson Title</Label>
                                  <Input
                                    id={`lesson-${lessonIndex}-title`}
                                    value={lesson.title}
                                    onChange={(e) => updateLesson(currentModuleIndex, lessonIndex, { title: e.target.value })}
                                    required
                                  />
                                </div>
                                
                                <button 
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this lesson?')) {
                                      removeLesson(currentModuleIndex, lessonIndex);
                                    }
                                  }}
                                  className="text-red-500 hover:text-red-700 mt-6"
                                >
                                  <Trash className="h-4 w-4" />
                                </button>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`lesson-${lessonIndex}-content`}>Content</Label>
                                <Textarea
                                  id={`lesson-${lessonIndex}-content`}
                                  value={lesson.content}
                                  onChange={(e) => updateLesson(currentModuleIndex, lessonIndex, { content: e.target.value })}
                                  placeholder="Enter the lesson content..."
                                  rows={3}
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 mt-3">
                                <div className="space-y-2">
                                  <Label htmlFor={`lesson-${lessonIndex}-duration`}>Duration</Label>
                                  <Input
                                    id={`lesson-${lessonIndex}-duration`}
                                    value={lesson.duration}
                                    onChange={(e) => updateLesson(currentModuleIndex, lessonIndex, { duration: e.target.value })}
                                    placeholder="e.g., 15 minutes"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor={`lesson-${lessonIndex}-video`}>Video URL (optional)</Label>
                                  <Input
                                    id={`lesson-${lessonIndex}-video`}
                                    value={lesson.videoUrl || ''}
                                    onChange={(e) => updateLesson(currentModuleIndex, lessonIndex, { videoUrl: e.target.value })}
                                    placeholder="https://example.com/video.mp4"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {(!formData.modules[currentModuleIndex].lessons || 
                             formData.modules[currentModuleIndex].lessons.length === 0) && (
                            <div className="text-center py-8 text-muted-foreground">
                              <p>No lessons in this module yet.</p>
                              <p>Click "Add Lesson" to get started.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <h3 className="font-semibold mb-2">No Module Selected</h3>
                      <p className="text-muted-foreground mb-4">
                        Select a module from the left sidebar or create a new one to manage its content.
                      </p>
                      <Button onClick={addModule}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Module
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button onClick={handleSubmit}>
                <Save className="mr-2 h-4 w-4" />
                Save Course
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CourseCreate;
