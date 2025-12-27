import { useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EvidenceItem {
  id: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
}

const evidenceData: EvidenceItem[] = [
  {
    id: '1',
    category: 'Test Plan',
    title: 'Risk-based Test Plan (Sample)',
    description: 'Scope, approach, entry/exit criteria, environments, and test data strategy.',
    tags: ['process', 'risk', 'release'],
    link: '#',
  },
  {
    id: '2',
    category: 'Test Cases',
    title: 'Regression Suite (Sample CSV)',
    description: 'High-signal cases with priority + tags (smoke/regression).',
    tags: ['manual', 'regression'],
    link: '#',
  },
  {
    id: '3',
    category: 'Traceability',
    title: 'Mini RTM (Requirements → Tests)',
    description: 'Mapping requirement to test case + automation status.',
    tags: ['process', 'coverage'],
    link: '#',
  },
  {
    id: '4',
    category: 'Bug Report',
    title: 'Bug Report Samples (Severity vs Priority)',
    description: 'Sample bugs with repro steps, evidence, expected/actual notes.',
    tags: ['triage', 'communication'],
    link: '#',
  },
  {
    id: '5',
    category: 'API Collection',
    title: 'Postman Collection (Sample)',
    description: 'Requests + tests; ready for Newman-style execution.',
    tags: ['api', 'negative', 'contract'],
    link: '#',
  },
  {
    id: '6',
    category: 'Playwright Report',
    title: 'Playwright HTML Report (Sample link)',
    description: 'Example report with traces/screenshots on failure.',
    tags: ['ui', 'automation', 'anti-flaky'],
    link: '#',
  },
  {
    id: '7',
    category: 'k6 Results',
    title: 'k6 Baseline Summary',
    description: 'p95/p99, error rate, throughput + thresholds.',
    tags: ['perf', 'thresholds'],
    link: '#',
  },
  {
    id: '8',
    category: 'Release',
    title: 'Release Checklist + Exit Criteria',
    description: 'Definition of Done versi QA: what "ready to ship" means.',
    tags: ['release', 'gate'],
    link: '#',
  },
];

const categories = [
  'All',
  'Test Plan',
  'Test Cases',
  'Traceability',
  'Bug Report',
  'API Collection',
  'Playwright Report',
  'k6 Results',
  'Release',
];

export const EvidenceVault = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = evidenceData.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="evidence-vault" className="mt-12 scroll-mt-20">
      <div className="bg-card border border-border rounded-2xl p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Evidence Vault</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Auditable artifacts: test plans, suites, reports, collections, and release gates.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search artifacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full sm:w-[200px] bg-muted/50"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[150px] bg-muted/50">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-muted/30 border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-primary">{item.category}</span>
                  <h3 className="font-semibold text-foreground mt-1 truncate">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs bg-background/50 border-border/70"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
                  asChild
                >
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    open
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No artifacts found matching your criteria.
          </div>
        )}
      </div>
    </section>
  );
};
