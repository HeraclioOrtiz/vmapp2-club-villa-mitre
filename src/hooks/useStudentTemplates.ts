import { useState, useEffect } from 'react';
import { gymService } from '../services/gymService';
import { StudentTemplatesResponse, TemplateAssignment, Professor } from '../types/gym';

interface UseStudentTemplatesState {
  templates: TemplateAssignment[];
  professor: Professor | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useStudentTemplates = (): UseStudentTemplatesState => {
  const [templates, setTemplates] = useState<TemplateAssignment[]>([]);
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await gymService.getMyTemplates();
      setTemplates(response.templates);
      setProfessor(response.professor);
    } catch (err: any) {
      console.error('Failed to fetch student templates:', err);
      setError(err.userMessage || err.message || 'Error al cargar plantillas');
      setTemplates([]);
      setProfessor(null);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchTemplates();
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    professor,
    loading,
    error,
    refetch
  };
};

export default useStudentTemplates;
