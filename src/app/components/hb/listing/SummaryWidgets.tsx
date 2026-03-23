import { 
  Building2, 
  Users, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Globe, 
  Briefcase, 
  BarChart3, 
  PieChart, 
  Settings,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { type WidgetConfig } from "../../../../types/widgets";
import { calculateWidgetValue, getWidgetColor, type GenericDataItem } from "../../../../utils/widgetCalculator";

interface SimpleWidget {
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon?: string;
  subtitle?: string;
}

interface SummaryWidgetsProps {
  widgets: (WidgetConfig | SimpleWidget)[];
  data?: GenericDataItem[]; // Optional: only needed for WidgetConfig with formulas
  onManageWidgets?: () => void;
  title?: string;
  className?: string;
}

// Type guard to check if widget is a WidgetConfig
function isWidgetConfig(widget: WidgetConfig | SimpleWidget): widget is WidgetConfig {
  return 'id' in widget && 'enabled' in widget;
}

export function SummaryWidgets({ 
  widgets, 
  data = [], 
  onManageWidgets, 
  title = "Summary",
  className = ""
}: SummaryWidgetsProps) {
  // Filter enabled widgets (for WidgetConfig) or show all (for SimpleWidget)
  const enabledWidgets = widgets.filter(w => isWidgetConfig(w) ? w.enabled : true);

  if (enabledWidgets.length === 0 && !onManageWidgets) {
    return null;
  }

  return (
    null
  );
}