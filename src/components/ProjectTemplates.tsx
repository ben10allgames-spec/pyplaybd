import { projectTemplates, type ProjectTemplate } from '@/lib/python-templates';
import { Badge } from '@/components/ui/badge';

interface ProjectTemplatesProps {
  onSelect: (template: ProjectTemplate) => void;
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-success/15 text-success border-success/30',
  intermediate: 'bg-warning/15 text-warning border-warning/30',
  advanced: 'bg-info/15 text-info border-info/30',
};

const ProjectTemplates = ({ onSelect }: ProjectTemplatesProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      {projectTemplates.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template)}
          className="group flex flex-col items-start gap-2 rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-primary/50 hover:bg-secondary"
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-2xl">{template.icon}</span>
            <Badge variant="outline" className={difficultyColors[template.difficulty]}>
              {template.difficulty}
            </Badge>
          </div>
          <h3 className="font-sans text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            {template.title}
          </h3>
          <p className="text-xs text-muted-foreground">{template.description}</p>
        </button>
      ))}
    </div>
  );
};

export default ProjectTemplates;
