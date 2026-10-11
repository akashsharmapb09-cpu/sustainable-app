import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export const metadata = { title: 'Journal', description: 'Field notes on practical sustainable living.' };

const articles = [
  { category: 'FOOD / EVERYDAY', title: 'The quiet power of using what is already there', summary: 'A simple kitchen check can reduce waste and make planning feel less like a second job.', time: '4 min read' },
  { category: 'CARE / REPAIR', title: 'Repair is a habit, not a personality type', summary: 'Start with one loose button, a small patch or a local repair service. The aim is to make another use possible.', time: '3 min read' },
  { category: 'METHOD / EVIDENCE', title: 'How to read an environmental estimate', summary: 'Units, geography and assumptions tell you as much as the headline number. Here is what to look for.', time: '5 min read' },
];

export default function BlogPage() {
  return <section className="container-shell py-12 sm:py-16 lg:py-20"><p className="eyebrow">THE JOURNAL / FIELD NOTES</p><h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[.98] tracking-editorial sm:text-6xl lg:text-7xl">Thoughtful notes for everyday life.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-muted">Practical reading about repair, food, habits and the limits of environmental estimates. These editorial previews are sample content, not a publication schedule.</p>
    <div className="mt-10 grid gap-4 md:grid-cols-3">{articles.map((article,index)=><article className="card-edge flex flex-col p-6 sm:p-7" key={article.title}><div className="flex items-center justify-between"><span className="eyebrow">{article.category}</span><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#eef4ea] text-moss"><BookOpen size={17}/></span></div><h2 className="mt-7 font-serif text-2xl leading-tight tracking-tight">{article.title}</h2><p className="mt-3 flex-1 text-sm leading-6 text-muted">{article.summary}</p><div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-xs text-muted"><span>{article.time}</span><span>Preview {String(index+1).padStart(2,'0')}</span></div></article>)}</div>
    <p className="mt-6 text-xs leading-5 text-muted">Want to check claims in context? Start with the <Link href="/methodology" className="font-semibold text-moss underline underline-offset-4">methodology</Link> rather than treating an illustrative estimate as an individual result.</p>
  </section>;
}
