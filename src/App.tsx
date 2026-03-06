import { ThemeProvider } from './context/ThemeContext';
import { LeadsDashboard } from './screens/leads/LeadsDashboard';

export default function App() {
  return (
    <ThemeProvider>
      <LeadsDashboard />
    </ThemeProvider>
  );
}
